import { BestGymsByLocation } from '@/components/best-gym/best-gyms-by-location'
import { FavGymSlider } from '@/components/fav-gym-slider'
import { getPaginatedGyms, getNextFavouriteGyms, getCityStates } from '@/lib/gyms-api'
import { headers } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ city: string }>
  searchParams: Promise<{ type?: string }>
}

const siteUrl = process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL || 'https://bestgyms.gymdues.com'

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { city: filter } = await params
  const { type = 'city' } = await searchParams

  // Strip "best-gyms-in-" prefix to get the location slug, then capitalize for display
  // const filterSlug = slug.startsWith('best-gyms-in-') ? slug.replace('best-gyms-in-', '') : slug
  const slug = filter

  const headersList = await headers()
  // x-pathname is set by middleware to the original subdomain path (e.g. /best-houston-gyms)
  const pathname = headersList.get('x-pathname') || `/best-${slug}-gyms`
  const base = siteUrl.replace(/\/$/, '')
  const canonicalUrl = `${base}${pathname}/`

  const locationLabel = type === 'state' ? `${filter} State` : filter
  const title = `Best Gyms in ${locationLabel} | Gymdues`
  const description = `Discover the top-rated gyms in ${locationLabel}. Compare membership prices, ratings, and amenities to find the best gym near you.`

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
          url: `${siteUrl}/images/bg-header.jpg`,
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
      images: [`${siteUrl}/images/bg-header.jpg`],
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
  
   const favGymsParams = meta.filterType === 'state' ? { state: filter } : { city: filter }
  const favGymsResult = await getNextFavouriteGyms({ perPage: 10, ...favGymsParams });
  
  const favGyms = favGymsResult.length > 0 ? favGymsResult : cities
const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/best-${slug}-gyms/`

  return (
    <>
      <link rel='canonical' href={canonicalUrl} />
      <meta property='og:url' content={canonicalUrl} />
      <BestGymsByLocation filter={filter} type={type} initialGyms={gyms} initialMeta={meta} />
      <div className='container mx-auto px-4'>
        <section className='mt-16 mb-12' aria-labelledby='fav-gym-heading'>
          <FavGymSlider gyms={favGyms} />
        </section>
      </div>
    </>
  )
}
