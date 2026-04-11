'use client'

import Link from 'next/link'
import { useState } from 'react'

const tiers = [
  {
    name: 'Starter',
    monthlyPrice: '$29',
    annualPrice: '$19',
    description: 'Everything you need to run real experiments.',
    features: ['Unlimited experiments', '100k impressions/mo', 'Edge middleware + SDK', 'Email support', 'Analytics integrations'],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    monthlyPrice: '$99',
    annualPrice: '$69',
    description: 'For teams serious about conversion optimization.',
    features: ['Unlimited experiments', '2M impressions/mo', 'Edge middleware + SDK', 'Priority support', 'Advanced analytics', 'Custom domains', 'Team seats'],
    cta: 'Start free trial',
    highlighted: true,
  },
]

export default function PricingBPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-6" style={{ background: '#f0f4f8', color: '#0F2235' }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#0F2235' }} />
          Variant B · URL change experiment
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pick a plan. Cancel anytime.</h1>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">No setup fees. No long-term contracts.</p>

        <div className="mt-6 inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => setAnnual(false)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={!annual ? { background: '#0F2235', color: '#fff' } : { color: '#6b7280' }}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={annual ? { background: '#0F2235', color: '#fff' } : { color: '#6b7280' }}
          >
            Annual
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#16a34a' }}>-30%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="bg-white border rounded-2xl p-6 flex flex-col"
            style={tier.highlighted ? { borderColor: '#0F2235', boxShadow: '0 0 0 1px #0F2235' } : { borderColor: '#e5e7eb' }}
          >
            <div className="mb-1 text-sm font-semibold text-gray-900">{tier.name}</div>
            <div className="flex items-baseline gap-0.5 mb-1">
              <span className="text-3xl font-bold text-gray-900">{annual ? tier.annualPrice : tier.monthlyPrice}</span>
              <span className="text-gray-400 text-sm">/mo</span>
            </div>
            {annual && (
              <div className="text-xs text-green-600 mb-1">Billed annually · save 30%</div>
            )}
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
                ? { background: '#0F2235', color: '#fff' }
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
            <p className="text-sm text-gray-600">You landed on <code className="bg-gray-100 px-1 rounded">/pricing</code>. The middleware sent you to <code className="bg-gray-100 px-1 rounded">/pricing-b</code> — a <strong>completely different URL</strong> with a different pricing structure.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <p className="text-sm text-gray-600">The other 50% stay on <code className="bg-gray-100 px-1 rounded">/pricing</code> and see a 3-tier Free / Pro / Enterprise structure.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <p className="text-sm text-gray-600">This is the most powerful pattern — test entirely different page architectures, flows, and information hierarchies.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to all demos</Link>
      </div>
    </main>
  )
}
