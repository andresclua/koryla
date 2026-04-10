export const STRIPE_PRICES = {
  starter: {
    monthly: 'price_1TKianIjaYaM2IiLFoVmyl68',
    yearly:  'price_1TKicKIjaYaM2IiL2NO7mW4B',
  },
  growth: {
    monthly: 'price_1TKibsIjaYaM2IiLPu9Vj0zH',
    yearly:  'price_1TKicqIjaYaM2IiLoNSjxL33',
  },
} as const

export const PLANS = {
  free: {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    experiments: 100,
    visitsPerMonth: 10_000,
    workspaces: 1,
    multivariate: false,
    webhooks: false,
    whiteLabel: false,
    analyticsDestinations: [] as string[],
    showBranding: true,
    supportLevel: 'none',
    stripePrices: null,
  },
  starter: {
    name: 'Starter',
    price: { monthly: 29, yearly: 290 },
    experiments: 3,
    visitsPerMonth: 50_000,
    workspaces: 1,
    multivariate: false,
    webhooks: false,
    whiteLabel: false,
    analyticsDestinations: ['ga4', 'plausible'],
    showBranding: false,
    supportLevel: 'email',
    stripePrices: STRIPE_PRICES.starter,
  },
  growth: {
    name: 'Growth',
    price: { monthly: 79, yearly: 790 },
    experiments: 10,
    visitsPerMonth: 500_000,
    workspaces: 3,
    multivariate: true,
    webhooks: true,
    whiteLabel: false,
    analyticsDestinations: ['ga4', 'posthog', 'plausible', 'mixpanel', 'amplitude', 'webhook'],
    showBranding: false,
    supportLevel: 'email',
    stripePrices: STRIPE_PRICES.growth,
  },
} as const

export type PlanKey = keyof typeof PLANS
