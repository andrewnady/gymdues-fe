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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

// Organization Schema (JSON-LD)
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Gymdues',
  alternateName: 'Gymdues LLC',
  slogan: 'Find the best gym near you compare memberships, prices, and reviews in minutes.',
  legalName: 'Gymdues LLC',
  email: 'support@gymdues.com',
  description: 'Gymdues for finding the best gym near you compare memberships, prices, and reviews in minutes.',
  founder: {
    '@type': 'Person',
    name: 'Admir Salcinovic',
    birthDate: '06/05/1986',
    email: 'admir@gymdues.com',
    givenName: 'Admir',
    hasOccupation: 'Owner',
    gender: 'Male',
    height: "5'10",
    weight: '160',
    jobTitle: 'CEO',
    knowsAbout: 'Gyms data, Pricing data, web development and technology',
    nationality: 'United States',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2383 Mulliston Lane Lawrenceville GA 30043',
    addressLocality: 'Atlanta',
    addressRegion: 'GA',
    postalCode: '30043',
    addressCountry: 'USA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '404-457-0305',
    contactType: 'Customer Support',
    contactOption: 'TollFree',
    areaServed: 'US',
    availableLanguage: ['English'],
  },
  url: 'https://gymdues.com',
  logo: {
    '@type': 'ImageObject',
    '@id': 'https://gymdues.com/',
    inLanguage: 'en-US',
    url: 'https://gymdues.com/images/logo.svg',
    contentUrl: 'https://gymdues.com/images/logo.svg',
    width: 200,
    height: 38,
    caption: 'Gymdues',
  },
}

export const metadata: Metadata = {
  title: 'GymDues - Find Your Perfect Gym',
  description: 'Discover the best fitness centers near you. Compare plans, read reviews, and join the gym that fits your lifestyle.',
  icons: {
    icon: '/images/fav-ic.png',
  },
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'GymDues',
    title: 'GymDues - Find Your Perfect Gym',
    description: 'Discover the best fitness centers near you. Compare plans, read reviews, and join the gym that fits your lifestyle.',
    images: [
      {
        url: `${siteUrl}/images/bg-header.jpg`,
        width: 1200,
        height: 630,
        alt: 'GymDues - Find Your Perfect Gym',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GymDues - Find Your Perfect Gym',
    description: 'Discover the best fitness centers near you. Compare plans, read reviews, and join the gym that fits your lifestyle.',
    images: [`${siteUrl}/images/bg-header.jpg`],
    creator: '@gymdues',
    site: '@gymdues',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PZ8GW8JZ');`,
          }}
        />
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7031WR3HD3"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7031WR3HD3');
            `,
          }}
        />
        {/* Ahrefs Analytics */}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="CFEn7gt98CZzzkoZLCa7iA"
          async
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PZ8GW8JZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* Organization Schema (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
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
