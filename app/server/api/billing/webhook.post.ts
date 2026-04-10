import { serverSupabaseServiceRole } from '#supabase/server'
import { STRIPE_PRICES, type PlanKey } from '~/lib/plans'
import type Stripe from 'stripe'

// Build a reverse-lookup map from price ID → { plan, period }
const PRICE_TO_PLAN: Record<string, { plan: PlanKey; period: 'monthly' | 'yearly' }> = {}
for (const [planKey, periods] of Object.entries(STRIPE_PRICES) as [PlanKey, { monthly: string; yearly: string }][]) {
  PRICE_TO_PLAN[periods.monthly] = { plan: planKey, period: 'monthly' }
  PRICE_TO_PLAN[periods.yearly] = { plan: planKey, period: 'yearly' }
}

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event)
  const signature = getHeader(event, 'stripe-signature')

  if (!rawBody || !signature) {
    throw createError({ statusCode: 400, message: 'Missing body or signature' })
  }

  const config = useRuntimeConfig()
  const stripe = getStripe()

  let stripeEvent: Stripe.Event
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripeWebhookSecret as string,
    )
  } catch {
    throw createError({ statusCode: 400, message: 'Invalid webhook signature' })
  }

  const supabase = serverSupabaseServiceRole(event)

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      const { workspace_id, workspace_slug, billing_period } = session.metadata ?? {}

      if (!workspace_id) break

      // Retrieve the subscription to get the price ID and resolve the plan
      let plan: PlanKey = 'free'
      let period: 'monthly' | 'yearly' = (billing_period as 'monthly' | 'yearly') ?? 'monthly'

      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        const priceId = subscription.items.data[0]?.price.id
        if (priceId && PRICE_TO_PLAN[priceId]) {
          plan = PRICE_TO_PLAN[priceId].plan
          period = PRICE_TO_PLAN[priceId].period
        }
      }

      await supabase
        .from('workspaces')
        .update({
          plan,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          billing_period: period,
        })
        .eq('id', workspace_id)

      break
    }

    case 'customer.subscription.updated': {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      const priceId = subscription.items.data[0]?.price.id
      const lookup = priceId ? PRICE_TO_PLAN[priceId] : null

      if (!lookup) break

      // Find workspace by customer ID
      const { data: ws } = await supabase
        .from('workspaces')
        .select('id')
        .eq('stripe_customer_id', subscription.customer as string)
        .single()

      if (!ws) break

      await supabase
        .from('workspaces')
        .update({
          plan: lookup.plan,
          billing_period: lookup.period,
          stripe_subscription_id: subscription.id,
        })
        .eq('id', ws.id)

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = stripeEvent.data.object as Stripe.Subscription

      const { data: ws } = await supabase
        .from('workspaces')
        .select('id')
        .eq('stripe_customer_id', subscription.customer as string)
        .single()

      if (!ws) break

      await supabase
        .from('workspaces')
        .update({
          plan: 'free',
          stripe_subscription_id: null,
        })
        .eq('id', ws.id)

      break
    }
  }

  return { received: true }
})
