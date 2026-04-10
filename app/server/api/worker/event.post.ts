import { createClient } from '@supabase/supabase-js'
import { hashApiKey } from '~/lib/apiKeys'

export default defineEventHandler(async (event) => {
  // Machine-to-machine auth — same pattern as config.get.ts
  const auth = getHeader(event, 'authorization')
  if (!auth?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Missing API key' })
  }

  const rawKey = auth.slice(7).trim()
  const keyHash = hashApiKey(rawKey)

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  const { data: apiKey } = await supabase
    .from('api_keys')
    .select('id, workspace_id')
    .eq('key_hash', keyHash)
    .maybeSingle()

  if (!apiKey) {
    throw createError({ statusCode: 401, message: 'Invalid API key' })
  }

  const body = await readBody(event)
  const { experiment_id, variant_id, session_id, event_type, metadata } = body

  if (!experiment_id || !variant_id || !session_id || !event_type) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  if (!['impression', 'conversion'].includes(event_type)) {
    throw createError({ statusCode: 400, message: 'Invalid event_type' })
  }

  // For impressions: deduplicate — one impression per session per experiment
  if (event_type === 'impression') {
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('experiment_id', experiment_id)
      .eq('session_id', session_id)
      .eq('event_type', 'impression')
      .maybeSingle()

    if (existing) return { ok: true, duplicate: true }
  }

  // Store event
  const { error } = await supabase.from('events').insert({
    workspace_id: apiKey.workspace_id,
    experiment_id,
    variant_id,
    session_id,
    event_type,
    metadata: metadata ?? null,
  })

  if (error) throw createError({ statusCode: 500, message: error.message })

  // Route to analytics destinations — fire-and-forget
  supabase
    .from('analytics_destinations')
    .select('provider, config')
    .eq('workspace_id', apiKey.workspace_id)
    .eq('enabled', true)
    .then(({ data: destinations }) => {
      if (!destinations?.length) return
      for (const dest of destinations) {
        routeToAnalytics(dest.provider, dest.config, {
          event_type,
          experiment_id,
          variant_id,
          session_id,
          metadata,
        }).catch(() => {})
      }
    })

  return { ok: true }
})

async function routeToAnalytics(
  provider: string,
  config: Record<string, string>,
  payload: { event_type: string; experiment_id: string; variant_id: string; session_id: string; metadata?: Record<string, unknown> }
) {
  const eventName = payload.event_type === 'impression' ? 'experiment_assigned' : 'experiment_converted'
  const props = {
    experiment_id: payload.experiment_id,
    variant_id: payload.variant_id,
    ...payload.metadata,
  }

  if (provider === 'posthog' && config.api_key && config.host) {
    await fetch(`${config.host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: config.api_key,
        event: eventName,
        distinct_id: payload.session_id,
        properties: props,
      }),
    })
  }

  if (provider === 'ga4' && config.measurement_id && config.api_secret) {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${config.measurement_id}&api_secret=${config.api_secret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: payload.session_id,
          events: [{ name: eventName, params: props }],
        }),
      }
    )
  }

  if (provider === 'webhook' && config.url) {
    await fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, ...props, session_id: payload.session_id }),
    })
  }
}
