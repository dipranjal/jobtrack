import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JobTrack — Your job search, in motion',
  description: 'A focused workspace for tracking every job application and next step.',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ObuLRfpNhebKHK0rbgZvcMykNg11qU.png',
    shortcut: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ObuLRfpNhebKHK0rbgZvcMykNg11qU.png',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ObuLRfpNhebKHK0rbgZvcMykNg11qU.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
