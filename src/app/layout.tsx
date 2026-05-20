import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const space = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Glyph - Your Personal Link Hub',
    template: '%s | Glyph',
  },
  description: 'Create your own mini personal site. Share links, music, and personality.',
  keywords: ['bio link', 'link in bio', 'personal site', 'profile page'],
  openGraph: {
    type: 'website',
    siteName: 'Glyph',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="vi" className={`${inter.variable} ${space.variable} ${mono.variable}`}>
        <body className="font-sans bg-surface text-white antialiased">
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#17171b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
