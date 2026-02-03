import { Suspense } from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { GymsMapPageClient } from '@/components/gyms-map-page-client'

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
      <div className='container mx-auto px-4 py-4'>
        <h1 className='sr-only'>Browse gyms by location</h1>
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
      </div>
    </div>
  )
}
