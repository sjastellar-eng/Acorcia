import type { Metadata } from 'next'
import './globals.css'
import { LocaleProvider } from '../hooks/useLocale'

export const metadata: Metadata = {
  title: 'Source Constructor — Know what to build. Build what matters.',
  description: 'AI-powered conversations that uncover your real desires and transform them into a structured project with a 90-day plan.',
  openGraph: {
    title: 'Source Constructor',
    description: 'Discover what you truly want to build.',
    url: 'https://sourceconstructor.com',
    siteName: 'Source Constructor',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-slate-900">
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
