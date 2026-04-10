import { serverSupabaseUser } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'

interface Body {
  workspaceSlug: string
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const { workspaceSlug } = await readBody<Body>(event)

  if (!workspaceSlug) {
    throw createError({ statusCode: 400, message: 'workspaceSlug is required' })
  }

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  // Get workspace
  const { data: ws } = await supabase
    .from('workspaces')
    .select('id, slug, stripe_customer_id')
    .eq('slug', workspaceSlug)
    .single()

  if (!ws) throw createError({ statusCode: 404, message: 'Workspace not found' })

  // Verify owner
  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', ws.id)
    .eq('user_id', user.id)
    .eq('role', 'owner')
    .maybeSingle()

  if (!member) throw createError({ statusCode: 403 })

  if (!ws.stripe_customer_id) {
    throw createError({ statusCode: 400, message: 'No billing account found' })
  }

  const stripe = getStripe()
  const config = useRuntimeConfig()
  const appUrl = config.public.appUrl

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: ws.stripe_customer_id as string,
    return_url: `${appUrl}/dashboard/${ws.slug}/billing`,
  })

  return { url: portalSession.url }
})
