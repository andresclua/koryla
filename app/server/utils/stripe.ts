import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const config = useRuntimeConfig()
    _stripe = new Stripe(config.stripeSecretKey as string, {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return _stripe
}
