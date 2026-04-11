import Link from 'next/link'

export default function HeadlineBPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-8" style={{ background: '#EEF2FF', color: '#4338CA' }}>
        <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#4338CA' }} />
        Variant B · Text change experiment
      </div>

      <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
        Stop guessing. Start converting.
      </h1>
      <p className="mt-4 text-lg text-gray-500 leading-relaxed max-w-lg mx-auto">
        Run server-side experiments without a single line of JavaScript on your page.
        The middleware handles everything before the browser even sees the HTML.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/thank-you"
          className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#4338CA' }}
        >
          Get started free
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-gray-600 text-sm font-semibold border border-gray-200 hover:border-gray-300 transition-all"
        >
          ← Back to demos
        </Link>
      </div>

      <div className="mt-16 bg-white border border-gray-200 rounded-2xl p-6 text-left">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">How this works</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <p className="text-sm text-gray-600">You landed on <code className="bg-gray-100 px-1 rounded">/headline</code>. The middleware ran <strong>before</strong> any HTML was sent.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <p className="text-sm text-gray-600">You were assigned <strong>Variant B</strong>. The middleware rewrote the request to <code className="bg-gray-100 px-1 rounded">/headline-b</code> — your browser never knew.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <p className="text-sm text-gray-600">The other 50% see <em>"Ship faster with A/B testing."</em> Same URL, different page, zero flicker.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
