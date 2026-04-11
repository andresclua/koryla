import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <main className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold" style={{ background: '#C96A3F' }}>
        ✓
      </div>

      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Conversion recorded.</h1>
      <p className="mt-3 text-gray-500 leading-relaxed">
        This page is the conversion goal for all three experiments.
        When you clicked any CTA, Koryla logged the event and attributed it to your assigned variant.
      </p>

      <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 text-left space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">What just happened</p>
        <div className="flex items-start gap-3">
          <span className="w-5 h-5 rounded-full bg-orange-50 text-orange-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
          <p className="text-sm text-gray-600">You were assigned a variant when you first visited an experiment URL.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="w-5 h-5 rounded-full bg-orange-50 text-orange-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
          <p className="text-sm text-gray-600">That assignment was stored in a <code className="bg-gray-100 px-1 rounded text-xs">ky_</code> cookie — so you&apos;d see the same variant on repeat visits.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="w-5 h-5 rounded-full bg-orange-50 text-orange-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
          <p className="text-sm text-gray-600">Clicking a CTA landed you here — Koryla matched the conversion to your variant and updated the experiment stats.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#C96A3F' }}
        >
          ← Back to all demos
        </Link>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        Clear your cookies to be re-assigned to a fresh variant.
      </p>
    </main>
  )
}
