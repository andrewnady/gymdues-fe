import { BestGymsSection } from '@/components/best-gym/best-gyms-section'
import { GymsPageFaqSection } from '@/components/gyms-page-faq-section'
import { ReadMoreText } from '@/components/read-more-text'
import { FavGymSlider } from '@/components/fav-gym-slider'
import { getCityStates, filterTopGyms, getNextFavouriteGyms } from '@/lib/gyms-api'
import { gymCities } from '@/types/gym'
import type { Metadata } from 'next'
import { headers } from 'next/headers'


const siteUrl = process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL || 'https://bestgyms.gymdues.com'

export async function generateMetadata(): Promise<Metadata> {
  // Get the current pathname from headers
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const base = siteUrl.replace(/\/$/, '')
  const canonicalUrl = pathname === '/' ? `${base}/` : `${base}${pathname}`

  return {
    title: 'Gyms & Membership Prices by Brand & City | Gymdues',
    description:
      'Browse gyms by brand or location and see membership price ranges, plan types, and key features before you join.',
    alternates: {
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

export default async function BestGyms() {
  const [{ states, cities }, { gyms, meta }, favGyms] = await Promise.all([
    getCityStates(),
    filterTopGyms({ page: 1, perPage: 12 }),
    getNextFavouriteGyms({ perPage: 10 }),
  ])
  const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/`

  return (
    <>
      <link rel='canonical' href={canonicalUrl} />
      <meta property='og:url' content={canonicalUrl} />
      <div className='min-h-screen'>
        <section className='bg-primary/5 py-20'>
          <div className='container mx-auto px-4 py-4 text-center max-w-screen-lg'>
            <h1 className='text-4xl font-bold mb-4'>Best Gyms in the World</h1>
            <ReadMoreText>
              Discover top-rated gyms by city and state. We highlight the best gyms based on ratings
              and reviews, so you can compare options and find the right place to train.
            </ReadMoreText>
          </div>
        </section>
        <div className='container mx-auto px-4 py-4'>
          <section className='py-10'>
            <BestGymsSection
              initialStates={states}
              initialCities={cities}
              initialGyms={gyms as unknown as gymCities[]}
              initialMeta={meta}
            />
          </section>

          {/* FAQs Section */}
          <section className='mt-16 mb-12' aria-labelledby='faq-heading'>
            <GymsPageFaqSection />
          </section>

          <section className='mt-16 mb-12' aria-labelledby='fav-gym-heading'>
            <FavGymSlider cities={favGyms} />
          </section>
        </div>
      </div>
    </>
  )
}
