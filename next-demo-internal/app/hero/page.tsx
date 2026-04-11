import Link from 'next/link'

export default function HeroPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
          Control variant · Design change experiment
        </div>

        <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
          A/B testing at the edge.
          <br />No JavaScript required.
        </h1>
        <p className="mt-4 text-lg text-gray-500 leading-relaxed max-w-lg mx-auto">
          Koryla runs in your Next.js middleware — server-side, before any HTML is sent.
          Zero layout shift. Zero flicker.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/thank-you"
            className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: '#C96A3F' }}
          >
            Start for free
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl text-gray-600 text-sm font-semibold border border-gray-200 hover:border-gray-300 transition-all"
          >
            ← Back to demos
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">How this works</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#FEF0E8', color: '#C96A3F' }}>1</span>
            <p className="text-sm text-gray-600">You got the <strong>Control</strong>: a centered single-column layout. The URL is <code className="bg-gray-100 px-1 rounded">/hero</code>.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#FEF0E8', color: '#C96A3F' }}>2</span>
            <p className="text-sm text-gray-600">The other 50% get a <strong>two-column layout</strong> with a product screenshot — the middleware rewrites <code className="bg-gray-100 px-1 rounded">/hero</code> → <code className="bg-gray-100 px-1 rounded">/hero-b</code> transparently.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#FEF0E8', color: '#C96A3F' }}>3</span>
            <p className="text-sm text-gray-600">Both variants share the same URL. No client-side JavaScript swaps the layout after load.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
