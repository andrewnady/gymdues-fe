import { BestGymsSection } from '@/components/best-gym/best-gyms-section'
import { GymsPageFaqSection } from '@/components/gyms-page-faq-section'
import { ReadMoreText } from '@/components/read-more-text'
import { getCityStates, filterTopGyms } from '@/lib/gyms-api'
import { gymCities } from '@/types/gym'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { gymsPageFaqs } from '@/data/gyms-page-faqs'


const siteUrl = process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL || 'https://bestgyms.gymdues.com'

export async function generateMetadata(): Promise<Metadata> {
  // Get the current pathname from headers
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const base = siteUrl.replace(/\/$/, '')
  const canonicalUrl = pathname === '/' ? `${base}/` : `${base}${pathname}`

  return {
    title: 'Best Gyms in the World | Gymdues',
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
      title: 'Best Gyms in the World | Gymdues',
      description:
        'Browse gyms by brand or location and see membership price ranges, plan types, and key features before you join.',
      siteName: 'GymDues',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/images/bg-header.jpg`,
          width: 1200,
          height: 630,
          alt: 'Best Gyms in the World | Gymdues',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Best Gyms in the World | Gymdues',
      description:
        'Browse gyms by brand or location and see membership price ranges, plan types, and key features before you join.',
      images: [`${siteUrl}/images/bg-header.jpg`],
      creator: '@gymdues',
      site: '@gymdues',
    },
  }
}

export default async function BestGyms() {
  const [{ states, cities }, { gyms, meta }] = await Promise.all([
    getCityStates(),
    filterTopGyms({ page: 1, perPage: 12 }),
  ])
  const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/`

  const mainSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

  // ItemList schema — drives rich results for the best gyms listing page
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Gyms in the World',
    description: 'Top-rated gyms worldwide ranked by ratings and reviews',
    numberOfItems: gyms.length,
    itemListElement: gyms.map((gym, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${mainSiteUrl}/gyms/${gym.slug}`,
      name: gym.name,
    })),
  }

  // FAQPage schema — built from static FAQ data
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: gymsPageFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <link rel='canonical' href={canonicalUrl} />
      <meta property='og:url' content={canonicalUrl} />
      {/* ItemList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
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
        </div>
      </div>
    </>
  )
}
