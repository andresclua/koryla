import { serverSupabaseUser } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'

interface Body {
  workspaceSlug: string
  priceId: string
  period: 'monthly' | 'yearly'
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const { workspaceSlug, priceId, period } = await readBody<Body>(event)

  if (!workspaceSlug || !priceId || !period) {
    throw createError({ statusCode: 400, message: 'workspaceSlug, priceId, and period are required' })
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

  const stripe = getStripe()
  const config = useRuntimeConfig()
  const appUrl = config.public.appUrl

  // Reuse or create Stripe customer
  let customerId = ws.stripe_customer_id as string | undefined

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        workspace_id: ws.id,
        workspace_slug: ws.slug,
      },
    })
    customerId = customer.id

    await supabase
      .from('workspaces')
      .update({ stripe_customer_id: customerId })
      .eq('id', ws.id)
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/${ws.slug}/billing?success=1`,
    cancel_url: `${appUrl}/dashboard/${ws.slug}/billing`,
    metadata: {
      workspace_id: ws.id,
      workspace_slug: ws.slug,
      billing_period: period,
    },
  })

  return { url: session.url }
})
