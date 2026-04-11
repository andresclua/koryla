import Link from 'next/link'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'For side projects and prototypes.',
    features: ['Up to 3 experiments', '10k impressions/mo', 'Edge middleware', 'Community support'],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    description: 'For growing teams running real experiments.',
    features: ['Unlimited experiments', '500k impressions/mo', 'Edge + SDK', 'Priority support', 'Analytics integrations'],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale deployments.',
    features: ['Unlimited everything', 'SLA guarantee', 'SSO & SAML', 'Dedicated support', 'Custom contracts'],
    cta: 'Contact us',
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
          Control variant · URL change experiment
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Simple, transparent pricing</h1>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">Start free. Scale when you need to. No surprises.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="bg-white border rounded-2xl p-6 flex flex-col"
            style={tier.highlighted ? { borderColor: '#C96A3F', boxShadow: '0 0 0 1px #C96A3F' } : { borderColor: '#e5e7eb' }}
          >
            {tier.highlighted && (
              <div className="text-xs font-semibold px-2 py-0.5 rounded-full text-white mb-4 self-start" style={{ background: '#C96A3F' }}>Most popular</div>
            )}
            <div className="mb-1 text-sm font-semibold text-gray-900">{tier.name}</div>
            <div className="flex items-baseline gap-0.5 mb-1">
              <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
              {tier.period && <span className="text-gray-400 text-sm">{tier.period}</span>}
            </div>
            <p className="text-xs text-gray-400 mb-5">{tier.description}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500 text-xs">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/thank-you"
              className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={tier.highlighted
                ? { background: '#C96A3F', color: '#fff' }
                : { background: '#f3f4f6', color: '#374151' }}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">How this works</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <p className="text-sm text-gray-600">You landed on <code className="bg-gray-100 px-1 rounded">/pricing</code>. The middleware assigned you the <strong>Control</strong>: a 3-tier layout.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <p className="text-sm text-gray-600">The other 50% are redirected to <code className="bg-gray-100 px-1 rounded">/pricing-b</code> — a different URL with a 2-tier structure and annual billing toggle.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <p className="text-sm text-gray-600">This pattern lets you test completely different page architectures, not just copy or layout changes.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to all demos</Link>
      </div>
    </main>
  )
}
