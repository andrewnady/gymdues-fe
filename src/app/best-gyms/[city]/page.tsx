import { BestGymsByLocation } from '@/components/best-gym/best-gyms-by-location'
import { FavGymSlider } from '@/components/fav-gym-slider'
import { ScrollToTop } from '@/components/scroll-to-top'
import { getPaginatedGyms, getNextFavouriteGyms, getCityStates } from '@/lib/gyms-api'
import { headers } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import { bestGymsFaqs } from '@/data/best-gyms-faqs'

interface PageProps {
  params: Promise<{ city: string }>
  searchParams: Promise<{ type?: string }>
}

const siteUrl = process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL || 'https://bestgyms.gymdues.com'

function extractCenterText(slug: string): string {
  return slug
    .replace(/^best-/, '')
    .replace(/-gyms$/, '')
    .replace(/-/g, ' ')
}
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { city: filter } = await params
  const { type = 'city' } = await searchParams

  const slug = `best-${filter}-gyms`

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || `/best-${filter}-gyms`
  const base = siteUrl.replace(/\/$/, '')
  const canonicalUrl = `${base}${pathname}/`

  const locationLabel = type === 'state' ? `${filter} State` : filter
  const title = `Best Gyms in ${locationLabel} | Gymdues`
  const description = `Discover the top-rated gyms in ${locationLabel}. Compare membership prices, ratings, and amenities to find the best gym near you.`

  // Fetch page data to get the featured image for OG/Twitter tags
  let ogImage = `${siteUrl}/images/bg-header.jpg`
  try {
    const { meta } = await getPaginatedGyms({ slug, page: 1, perPage: 1, fields: 'topgyms' })
    if (meta.featuredImage) ogImage = meta.featuredImage
  } catch {
    // fall back to default image
  }

  return {
    title,
    description,
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
      title,
      description,
      siteName: 'GymDues',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@gymdues',
      site: '@gymdues',
    },
  }
}

export default async function BestCityGymsPage({ params, searchParams }: PageProps) {
  
  const { city: filter } = await params
  const { type = 'city' } = await searchParams

  // Strip "best-gyms-in-" prefix to get the location slug, then capitalize for display
  // const filterSlug = slug.startsWith('best-gyms-in-') ? slug.replace('best-gyms-in-', '') : slug
  const slug =  `best-${filter}-gyms`
  const base = siteUrl.replace(/\/$/, '')
  const pageUrl = `${base}/${slug}/`

  const locationName = filter.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const breadcrumbLabel = type === 'state' ? `${locationName} State` : locationName

  let breadcrumbSchema = null

  if (filter) {
    breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${base}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": `Best Gyms in ${breadcrumbLabel}`,
          "item": pageUrl
        }
      ]
    }
  }

  const gymsParams: {
    slug?: string
    state?: string
    city?: string
    page: number
    perPage: number
    fields?: string
  } = {
    page: 1,
    perPage: 12,
    fields: 'topgyms',
  }

  if (slug) {
    // New API slug format — backend resolves state/city from slug directly
    gymsParams.slug = slug
  }



  const { gyms, meta } = await getPaginatedGyms(gymsParams).catch(() => permanentRedirect(siteUrl))
  if (!gyms?.length) permanentRedirect(siteUrl)

  const { cities } = await getCityStates()

  const favGymFilter = extractCenterText(filter);
   const favGymsParams = meta.filterType === 'state' ? { state: favGymFilter } : { city: favGymFilter }
  const favGymsResult = await getNextFavouriteGyms({ perPage: 10, ...favGymsParams });

  const favGyms = favGymsResult.length > 0 ? favGymsResult : cities
const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/${slug}/`

  // ItemList schema — drives rich results for list-style pages
  const mainSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Gyms in ${breadcrumbLabel}`,
    description: `Top-rated gyms in ${breadcrumbLabel} ranked by ratings and reviews`,
    numberOfItems: gyms.length,
    itemListElement: gyms.map((gym, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${mainSiteUrl}/gyms/${gym.slug}`,
      name: gym.name,
    })),
  }

  // FAQPage schema — built from static FAQ data with location substituted
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: bestGymsFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question.replace(/\{location\}/g, breadcrumbLabel),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.replace(/\{location\}/g, breadcrumbLabel),
      },
    })),
  }

  return (
    <>
      <ScrollToTop />
      <link rel='canonical' href={canonicalUrl} />
      <meta property='og:url' content={canonicalUrl} />

      {/* Breadcrumb schema */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}
      {/* ItemList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema),
        }}
      />

      <BestGymsByLocation filter={filter} type={type} initialGyms={gyms} initialMeta={meta} featuredImage={meta.featuredImage ?? `${siteUrl}/images/bg-header.jpg`} />
      <div className='container mx-auto px-4'>
        <section className='mt-16 mb-12' aria-labelledby='fav-gym-heading'>
          <FavGymSlider gyms={favGyms} />
        </section>
      </div>
    </>
  )
}
