import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MSKL.io - Where Sharp Minds Meet Real-World Challenges',
  description: 'Every two weeks, a new mission drops. Win prizes. Unlock exclusive events. Level up your future.',
  keywords: 'real-world challenges, problem-solving, student competitions, innovation, academic excellence',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon-large.svg', sizes: '64x64', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
