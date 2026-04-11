import Link from 'next/link'

export default function HeroBPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      <div className="mb-6 flex justify-center">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: '#FEF0E8', color: '#C96A3F' }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#C96A3F' }} />
          Variant B · Design change experiment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            A/B testing at the edge.
            <br />No JavaScript required.
          </h1>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            Koryla runs in your Next.js middleware — server-side, before any HTML is sent.
            Zero layout shift. Zero flicker.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/thank-you"
              className="px-6 py-3 rounded-xl text-white text-sm font-semibold text-center transition-all hover:opacity-90"
              style={{ background: '#C96A3F' }}
            >
              Start for free
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl text-gray-600 text-sm font-semibold text-center border border-gray-200 hover:border-gray-300 transition-all"
            >
              ← Back to demos
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="bg-gray-50 rounded-xl p-4 mb-4 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold" style={{ background: '#C96A3F' }}>K</div>
              <div className="text-sm font-semibold text-gray-700">Koryla Dashboard</div>
              <div className="text-xs text-gray-400 mt-1">Experiment · Headline Copy Test · Active</div>
              <div className="mt-3 flex justify-center gap-4 text-xs">
                <div className="text-center">
                  <div className="font-bold text-gray-900">2,841</div>
                  <div className="text-gray-400">Impressions</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">4.7%</div>
                  <div className="text-gray-400">Conv. rate</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Live experiment · started 3 days ago</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Active</span>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">How this works</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#FEF0E8', color: '#C96A3F' }}>1</span>
            <p className="text-sm text-gray-600">You got <strong>Variant B</strong>: a two-column layout with a product screenshot.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#FEF0E8', color: '#C96A3F' }}>2</span>
            <p className="text-sm text-gray-600">You visited <code className="bg-gray-100 px-1 rounded">/hero</code>. The middleware rewrote it to <code className="bg-gray-100 px-1 rounded">/hero-b</code> server-side.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#FEF0E8', color: '#C96A3F' }}>3</span>
            <p className="text-sm text-gray-600">The other 50% see a centered single-column layout — same URL, completely different design.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
