/**
 * @koryla/react — server helper
 *
 * Use this in React Server Components (Next.js App Router, Remix, etc.)
 * to assign a variant before rendering. Zero client-side JavaScript.
 *
 * Usage (Next.js App Router):
 *   // lib/koryla.ts
 *   import { createKoryla } from '@koryla/react/server'
 *   export const koryla = createKoryla({
 *     apiKey: process.env.KORYLA_API_KEY!,
 *     apiUrl: process.env.KORYLA_API_URL!,
 *   })
 *
 *   // app/page.tsx
 *   import { headers } from 'next/headers'
 *   import { koryla } from '@/lib/koryla'
 *   import { Experiment, Variant } from '@koryla/react/components'
 *
 *   export default async function Page() {
 *     const result = await koryla.getVariant('exp-id', headers().get('cookie') ?? '')
 *
 *     return (
 *       <Experiment variantId={result?.variantId ?? ''}>
 *         <Variant id="control"><HeroOriginal /></Variant>
 *         <Variant id="variant-b"><HeroVariantB /></Variant>
 *       </Experiment>
 *     )
 *   }
 *
 *   // On the conversion page:
 *   // await koryla.reportConversion(result)
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

/**
 * Creates a Koryla client for use in server components.
 * Call this once per app (e.g. in lib/koryla.ts) — the instance holds the
 * in-memory config cache so experiments are only fetched once per 60s.
 */
export function createKoryla(options: SplitEngineOptions) {
  const engine = createSplitEngine(options)

  async function fireEvent(payload: {
    experiment_id: string
    variant_id: string
    session_id: string
    event_type: 'impression' | 'conversion'
  }): Promise<void> {
    try {
      await fetch(`${options.apiUrl}/api/worker/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${options.apiKey}` },
        body: JSON.stringify(payload),
      })
    } catch { /* network error — don't break rendering */ }
  }

  /**
   * Look up the active experiment by ID and assign/read the visitor's variant.
   * Fires an impression event to the Koryla API (deduplicated server-side by session).
   * Returns null if the experiment doesn't exist or has no variants.
   *
   * @param experimentId  The experiment ID from your Koryla dashboard.
   * @param cookieHeader  The raw Cookie header from the incoming request.
   */
  async function getVariant(
    experimentId: string,
    cookieHeader: string,
  ): Promise<VariantResult | null> {
    const experiments = await engine.getConfig()
    const experiment = experiments.find(e => e.id === experimentId)
    if (!experiment || !experiment.variants.length) return null

    const cookies = parseCookies(cookieHeader)
    const sessionId = cookies['ky_session'] ?? generateSessionId()
    const { variantId, isNewAssignment, cookieName } = getVariantFromCookies(
      cookies,
      experimentId,
      experiment.variants,
    )
    const variant = experiment.variants.find(v => v.id === variantId)!

    // Fire impression — backend deduplicates per session_id
    fireEvent({ experiment_id: experimentId, variant_id: variantId, session_id: sessionId, event_type: 'impression' })

    return { experiment, variant, variantId, isNewAssignment, cookieName, sessionId }
  }

  /**
   * Report a conversion event. Call this server-side on the conversion page,
   * passing the VariantResult returned by getVariant.
   */
  async function reportConversion(result: VariantResult): Promise<void> {
    await fireEvent({
      experiment_id: result.experiment.id,
      variant_id: result.variantId,
      session_id: result.sessionId,
      event_type: 'conversion',
    })
  }

  return { getVariant, reportConversion }
}
