import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Koryla Next.js Demo',
  description: 'Three live A/B testing examples using @koryla/next middleware',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <nav className="bg-white border-b border-gray-100 px-6 h-14 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#C96A3F' }}>K</div>
          <span className="font-semibold text-sm" style={{ color: '#0F2235' }}>Koryla</span>
          <span className="text-gray-300 text-xs">|</span>
          <span className="text-xs text-gray-400">Next.js Demo</span>
          <a href="/" className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors">← All demos</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
