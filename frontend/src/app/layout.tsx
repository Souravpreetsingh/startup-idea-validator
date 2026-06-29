import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: {
    default: 'AI Startup Idea Validator',
    template: '%s | AI Startup Validator',
  },
  description:
    'Validate your startup idea using AI. Analyze market demand, competition, SWOT, revenue models, and success probability instantly.',
  openGraph: {
    title: 'AI Startup Idea Validator',
    description:
      'Validate your startup idea using AI. Market analysis, competitor research, SWOT, and revenue modeling in seconds.',
    type: 'website',
    siteName: 'Validator Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Startup Idea Validator',
    description:
      'Validate your startup idea using AI. Market analysis, competitor research, SWOT, and revenue modeling in seconds.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-background text-on-background font-body-md antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1c1b1a',
                color: '#fcf9f6',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
