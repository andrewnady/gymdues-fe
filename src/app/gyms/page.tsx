import { Suspense } from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { GymsMapPageClient } from '@/components/gyms-map-page-client'
import { GymsPageFaqSection } from '@/components/gyms-page-faq-section'
import { ReadMoreText } from '@/components/read-more-text'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

export async function generateMetadata(): Promise<Metadata> {
  // Get the current pathname from headers
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/gyms'
  // Use the pathname as-is to match the current URL (preserve trailing slash)
  const canonicalUrl = new URL(pathname, siteUrl).toString()

  return {
    title: 'Gyms & Membership Prices by Brand & City | Gymdues',
    description:
      'Browse gyms by brand or location and see membership price ranges, plan types, and key features before you join.',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': canonicalUrl,
        'x-default': canonicalUrl,
      },
    },
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
      title: 'Gyms & Membership Prices by Brand & City | Gymdues',
      description:
        'Browse gyms by brand or location and see membership price ranges, plan types, and key features before you join.',
      url: `${siteUrl}/gyms/`,
      siteName: 'GymDues',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/images/bg-header.jpg`,
          width: 1200,
          height: 630,
          alt: 'Gyms & Membership Prices by Brand & City | Gymdues',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Gyms & Membership Prices by Brand & City | Gymdues',
      description:
        'Browse gyms by brand or location and see membership price ranges, plan types, and key features before you join.',
      images: [`${siteUrl}/images/bg-header.jpg`],
      creator: '@gymdues',
      site: '@gymdues',
    },
  }
}

export default function GymsPage() {
  return (
    <div className='min-h-screen'>
      <noscript>
        <div className='container mx-auto px-4 py-8'>
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6'>
            <h2 className='text-xl font-semibold text-yellow-800 mb-2'>
              JavaScript Required
            </h2>
            <p className='text-yellow-700'>
              This page requires JavaScript to be enabled to display gym listings and interactive features. 
              Please enable JavaScript in your browser settings to use this page.
            </p>
          </div>
        </div>
      </noscript>
      <div className='container mx-auto px-4 py-4'>
        <div className='my-12 text-center max-w-screen-lg mx-auto'>
          <h1 className='text-4xl font-bold mb-4'>
            Browse Gyms Near You: Compare Membership Prices, Plans, and Fees by City or Zip Code
          </h1>
          <ReadMoreText className='text-muted-foreground text-lg mx-auto mb-6'>
            Browse gyms by city or zip code and compare membership prices, plans, and common fees in one place. GymDues helps you research popular searches like <strong>xsport membership cost</strong>, <strong>xsport fitness membership cost</strong>, <strong>xsport membership plans</strong>, <strong>la fitness membership cost</strong>, <strong>anytime fitness membership cost</strong>, <strong>24 hour fitness membership cost</strong>, <strong>ufc gym membership cost</strong>, <strong>fit body boot camp cost per month</strong>, <strong>9 round prices</strong>, <strong>pure barre pricing</strong>, <strong>fitness connection membership cost</strong>, <strong>nysc membership cost</strong>, <strong>princeton club membership cost</strong>, and <strong>newtown athletic club membership cost</strong>—then click into any gym for full details.
          </ReadMoreText>
        </div>
        <Suspense
          fallback={
            <div className='flex flex-col h-[calc(100vh-8rem)] min-h-[500px]'>
              <div className='h-24 bg-muted/50 animate-pulse rounded-t-lg' />
              <div className='flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0'>
                <div className='p-4 space-y-2'>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className='h-20 bg-muted animate-pulse rounded-md' />
                  ))}
                </div>
                <div className='bg-muted/30 flex items-center justify-center text-muted-foreground'>
                  Loading map…
                </div>
              </div>
            </div>
          }
        >
          <GymsMapPageClient />
        </Suspense>

        {/* FAQs Section */}
        <section className='mt-16 mb-12' aria-labelledby='faq-heading'>
          <GymsPageFaqSection />
        </section>
      </div>
    </div>
  )
}
