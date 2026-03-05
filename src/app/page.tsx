import type { Metadata } from 'next'
//import Link from 'next/link'
import {
  getTrendingGyms,
  getLatestGyms,
  getAllGyms,
  getRatedGyms,
  getBestGymsBySlug,
  getPopularGymsStateCities,
} from '@/lib/gyms-api'
import { getAllReviews } from '@/lib/reviews-api'
import { getRecentBlogPosts } from '@/lib/blog-api'
import { BlogPost } from '@/types/blog'
import { Gym, ReviewWithGym } from '@/types/gym'
import { NewsletterSubscription } from '@/components/newsletter-subscription'
import { HeroSection } from '@/components/hero-section'
//import { WhyChooseSection } from '@/components/why-choose-section'
import { TrendingGymsSection } from '@/components/trending-gyms-section'
import { ReviewsSection } from '@/components/reviews-section'
import { BlogSection } from '@/components/blog-section'
import { RedirectGymsHash } from '@/components/redirect-gyms-hash'
import { RatedGymsSection } from '@/components/rated-gyms-section'
import { BestGymsLocationSection } from '@/components/best-gyms-location-section'
import { PopularCitiesSlider } from '@/components/popular-cities-slider'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GymDues',
  alternateName: [
    'Gym Dues',
    'https://gymdues.com',
    'Gym Membership Prices',
    'Gym Membership Cost',
    'Gym Pricing Database',
  ],
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search#search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'GymDues',
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/logo.svg`,
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  // Homepage always uses root path with trailing slash
  const canonicalUrl = new URL('/', siteUrl).toString()

  return {
    title: 'Gym Membership Costs & Prices (2026) | Gymdues',
    description:
      'Compare gym membership prices by brand and location. See monthly costs, plans, fees, and tips to find the best deal.',
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
      title: 'Gym Membership Costs & Prices (2026) | Gymdues',
      description:
        'Compare gym membership prices by brand and location. See monthly costs, plans, fees, and tips to find the best deal.',
      url: `${siteUrl}/`,
      siteName: 'GymDues',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/images/bg-header.jpg`,
          width: 1200,
          height: 630,
          alt: 'Gym Membership Costs & Prices (2026) | Gymdues',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Gym Membership Costs & Prices (2026) | Gymdues',
      description:
        'Compare gym membership prices by brand and location. See monthly costs, plans, fees, and tips to find the best deal.',
      images: [`${siteUrl}/images/bg-header.jpg`],
      creator: '@gymdues',
      site: '@gymdues',
    },
  }
}

export default async function Home() {
  // Run all independent data fetches in parallel to keep first load fast
  const [
    trendingResult,
    popularResult,
    ratedResult,
    nyBestResult,
    caBestResult,
    reviewsResult,
    postsResult,
    popularCitiesResult,
  ] = await Promise.allSettled([
    getTrendingGyms(),
    getAllGyms(undefined, undefined, undefined, undefined, true),
    getRatedGyms(20),
    getBestGymsBySlug('best-new-york-gyms', 20),
    getBestGymsBySlug('best-california-gyms', 20),
    getAllReviews(12),
    getRecentBlogPosts(3),
    getPopularGymsStateCities(),
  ])

  let trendingGyms: Gym[] = []
  if (trendingResult.status === 'fulfilled') {
    trendingGyms = trendingResult.value
  } else {
    console.error('Failed to load trending gyms:', trendingResult.reason)
  }

  // Fallback: if trending is empty, fetch latest 10 gyms
  if (trendingGyms.length === 0) {
    try {
      trendingGyms = await getLatestGyms(10)
    } catch (error) {
      console.error('Failed to load latest gyms fallback:', error)
    }
  }

  let popularGyms: Gym[] = []
  if (popularResult.status === 'fulfilled') {
    popularGyms = popularResult.value.slice(0, 5)
  } else {
    console.error('Failed to load popular gyms:', popularResult.reason)
  }

  let ratedGyms: Gym[] = []
  if (ratedResult.status === 'fulfilled') {
    ratedGyms = ratedResult.value
  } else {
    console.error('Failed to load rated gyms:', ratedResult.reason)
  }

  let nyBestGyms: Gym[] = []
  if (nyBestResult.status === 'fulfilled') {
    nyBestGyms = nyBestResult.value
  } else {
    console.error('Failed to load New York best gyms:', nyBestResult.reason)
  }

  let caBestGyms: Gym[] = []
  if (caBestResult.status === 'fulfilled') {
    caBestGyms = caBestResult.value
  } else {
    console.error('Failed to load California best gyms:', caBestResult.reason)
  }

  const popularCities = popularCitiesResult.status === 'fulfilled' ? popularCitiesResult.value : []

  let reviews: ReviewWithGym[] = []
  if (reviewsResult.status === 'fulfilled') {
    reviews = reviewsResult.value
    // Format dates on server side to prevent hydration mismatches
    reviews = reviews.map((review) => {
      const date = new Date(review.reviewed_at)
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      const formattedDate = isNaN(date.getTime())
        ? ''
        : `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
      return {
        ...review,
        formattedDate,
      }
    })
  } else {
    console.error('Failed to load reviews:', reviewsResult.reason)
  }

  let recentPosts: BlogPost[] = []
  if (postsResult.status === 'fulfilled') {
    recentPosts = postsResult.value
  } else {
    console.error('Failed to load recent blog posts:', postsResult.reason)
  }

  const reviewSchema =
    reviews.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'GymDues',
          url: siteUrl,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (
              reviews.reduce((sum, r) => sum + (r.rate || r.rating || 0), 0) / reviews.length
            ).toFixed(1),
            reviewCount: reviews.length,
            bestRating: '5',
            worstRating: '1',
          },
          review: reviews.map((review) => ({
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: review.reviewer,
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: String(review.rate || review.rating),
              bestRating: '5',
              worstRating: '1',
            },
            reviewBody: review.text,
            datePublished: (() => {
              const d = new Date(review.reviewed_at)
              return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : undefined
            })(),
            itemReviewed: {
              '@type': 'LocalBusiness',
              name: review.gymName || review.gym?.name,
            },
          })),
        }
      : null

  return (
    <div className='min-h-screen'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {reviewSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
      <RedirectGymsHash />
      <HeroSection popularGyms={popularGyms} />
      {/* <WhyChooseSection /> */}
      {/* <ListingByStateSection states={states} /> */}
      <TrendingGymsSection gyms={trendingGyms} />
      <RatedGymsSection gyms={ratedGyms} />
      <BestGymsLocationSection
        title='Best Gyms in New York City, NY'
        description="Looking for the best gyms in New York? Whether you’re in NYC or anywhere across the state, New York offers everything from luxury fitness clubs and boutique studios to affordable 24/7 gyms and specialized strength-training facilities. Use GymDues to compare locations, membership options, amenities (weights, cardio, classes, pools, saunas), ratings, and real reviews—so you can quickly find a gym that matches your goals, schedule, and budget."
        gyms={nyBestGyms}
      />
      <BestGymsLocationSection
        title='Best Gyms in California'
        description="Searching for the best gyms in California? From Los Angeles and San Diego to San Francisco and beyond, California has an incredible range of gyms—high-end health clubs, CrossFit boxes, Pilates and yoga studios, and budget-friendly chains with multiple locations. On GymDues, you can compare gym memberships, amenities, hours, ratings, and reviews to choose the right gym for your lifestyle—whether you want serious strength training, group classes, or a flexible monthly plan."
        gyms={caBestGyms}
      />
      <PopularCitiesSlider cities={popularCities} />
      <ReviewsSection reviews={reviews} />
      <BlogSection posts={recentPosts} />

      {/* Data & use cases – link to gym database and tools (relates to main page) */}
      {/* <section className='py-16 md:py-20 border-t bg-muted/20' aria-labelledby='data-tools-heading'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 id='data-tools-heading' className='text-2xl md:text-3xl font-bold tracking-tight mb-2'>
              Gym database & use cases
            </h2>
            <p className='text-muted-foreground mb-6'>
              Explore the full U.S. gym database, growth trends, competitive intelligence, free sample tiers, and guides for agencies, software companies, equipment suppliers, and franchise development.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href='/gymsdata/checkout'
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md transition-all'
              >
                Buy dataset
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </Link>
              <Link
                href='/gymsdata#use-cases-heading'
                className='inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-transparent px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-all'
              >
                Data & use cases
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Newsletter Section */}
      <section className='py-20 bg-primary/5'>
        <div className='container mx-auto px-4'>
          <NewsletterSubscription />
        </div>
      </section>
    </div>
  )
}
