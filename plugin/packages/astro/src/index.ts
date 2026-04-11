/**
 * @koryla/astro
 *
 * Server-side A/B testing helper for Astro.
 * Reads the visitor's variant from cookies (or assigns a new one) without
 * any client-side JavaScript.
 *
 * Usage (Astro page or layout):
 *   ---
 *   import { getVariant, reportConversion } from '@koryla/astro'
 *
 *   const result = await getVariant(Astro.request, 'exp-id', {
 *     apiKey: import.meta.env.KORYLA_API_KEY,
 *     apiUrl: import.meta.env.KORYLA_API_URL,
 *   })
 *
 *   if (result?.isNewAssignment) {
 *     Astro.cookies.set(result.cookieName, result.variantId, {
 *       maxAge: 60 * 60 * 24 * 30, sameSite: 'lax', path: '/',
 *     })
 *   }
 *   ---
 *
 *   {result?.variantId === 'control' ? <HeroOriginal /> : <HeroVariantB />}
 */

import { createSplitEngine, parseCookies, getVariantFromCookies } from '@koryla/core'
import type { SplitEngineOptions, Experiment, Variant } from '@koryla/core'

export interface VariantResult {
  experiment: Experiment
  variant: Variant
  variantId: string
  isNewAssignment: boolean
  cookieName: string
  sessionId: string
}

function generateSessionId(): string {
  try { return crypto.randomUUID() } catch { return Math.random().toString(36).slice(2) + Date.now().toString(36) }
}

async function fireEvent(
  payload: { experiment_id: string; variant_id: string; session_id: string; event_type: 'impression' | 'conversion' },
  options: SplitEngineOptions,
): Promise<void> {
  try {
    await fetch(`${options.apiUrl}/api/worker/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${options.apiKey}` },
      body: JSON.stringify(payload),
    })
  } catch { /* network error — don't break rendering */ }
}

// Module-level engine cache so the config isn't re-fetched on every request
const engines = new Map<string, ReturnType<typeof createSplitEngine>>()

/**
 * Returns the active variant for an experiment and fires an impression.
 *
 * @param request       The Astro.request object (or any Request).
 * @param experimentId  The experiment ID shown in your Koryla dashboard.
 * @param options       `{ apiKey, apiUrl }` — use import.meta.env in Astro.
 */
export async function getVariant(
  request: Request,
  experimentId: string,
  options: SplitEngineOptions,
): Promise<VariantResult | null> {
  const cacheKey = `${options.apiKey}:${options.apiUrl}`
  if (!engines.has(cacheKey)) {
    engines.set(cacheKey, createSplitEngine(options))
  }
  const engine = engines.get(cacheKey)!

  const experiments = await engine.getConfig()
  const experiment = experiments.find(e => e.id === experimentId)
  if (!experiment || !experiment.variants.length) return null

  const cookieHeader = request.headers.get('cookie') ?? ''
  const cookies = parseCookies(cookieHeader)
  const sessionId = cookies['ky_session'] ?? generateSessionId()
  const { variantId, isNewAssignment, cookieName } = getVariantFromCookies(
    cookies,
    experimentId,
    experiment.variants,
  )
  const variant = experiment.variants.find(v => v.id === variantId)!

  // Fire impression — backend deduplicates per session_id
  fireEvent({ experiment_id: experimentId, variant_id: variantId, session_id: sessionId, event_type: 'impression' }, options)

  return { experiment, variant, variantId, isNewAssignment, cookieName, sessionId }
}

/**
 * Report a conversion. Call this on the conversion page,
 * passing the VariantResult returned by getVariant.
 */
export async function reportConversion(
  result: VariantResult,
  options: SplitEngineOptions,
): Promise<void> {
  await fireEvent({
    experiment_id: result.experiment.id,
    variant_id: result.variantId,
    session_id: result.sessionId,
    event_type: 'conversion',
  }, options)
}
