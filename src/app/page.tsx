import type { Metadata } from 'next'
import {
  getTrendingGyms,
  getLatestGyms,
  getAllGyms,
  getRatedGyms,
  getBestGymsByState,
} from '@/lib/gyms-api'
import { getAllReviews } from '@/lib/reviews-api'
import { getRecentBlogPosts } from '@/lib/blog-api'
import { BlogPost } from '@/types/blog'
import { Gym, ReviewWithGym } from '@/types/gym'
import { NewsletterSubscription } from '@/components/newsletter-subscription'
import { HeroSection } from '@/components/hero-section'
import { WhyChooseSection } from '@/components/why-choose-section'
import { TrendingGymsSection } from '@/components/trending-gyms-section'
import { ReviewsSection } from '@/components/reviews-section'
import { BlogSection } from '@/components/blog-section'
import { RedirectGymsHash } from '@/components/redirect-gyms-hash'
import { RatedGymsSection } from '@/components/rated-gyms-section'
import { BestGymsLocationSection } from '@/components/best-gyms-location-section'

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
  ] = await Promise.allSettled([
    getTrendingGyms(),
    getAllGyms(undefined, undefined, undefined, undefined, true),
    getRatedGyms(20),
    getBestGymsByState('New York', 20),
    getBestGymsByState('California', 20),
    getAllReviews(12),
    getRecentBlogPosts(3),
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
      <WhyChooseSection />
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
      <ReviewsSection reviews={reviews} />
      <BlogSection posts={recentPosts} />

      {/* Newsletter Section */}
      <section className='py-20 bg-primary/5'>
        <div className='container mx-auto px-4'>
          <NewsletterSubscription />
        </div>
      </section>
    </div>
  )
}
