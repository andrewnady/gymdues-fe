import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { CounterStoreProvider } from '@/providers/counter-store-provider'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'GymDues - Find Your Perfect Gym',
  description: 'Discover the best fitness centers near you. Compare plans, read reviews, and join the gym that fits your lifestyle.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Theme>
          <CounterStoreProvider>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-1 relative">{children}</main>
              <Footer />
            </div>
          </CounterStoreProvider>
        </Theme>
      </body>
    </html>
  )
}
