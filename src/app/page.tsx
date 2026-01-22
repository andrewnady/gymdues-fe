import type { Metadata } from 'next'
import { getTrendingGyms, getAllGyms } from '@/lib/gyms-api'
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

export const metadata: Metadata = {
  title: 'Gym Membership Costs & Prices (2026) | Gymdues',
  description:
    'Compare gym membership prices by brand and location. See monthly costs, plans, fees, and tips to find the best deal.',
  alternates: {
    canonical: new URL('/', siteUrl).toString(),
    languages: {
      'en-US': new URL('/', siteUrl).toString(),
      'x-default': new URL('/', siteUrl).toString(),
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

export default async function Home() {

  let trendingGyms: Gym[] = []
  try {
    trendingGyms = await getTrendingGyms(3)
  } catch (error) {
    console.error('Failed to load trending gyms:', error)
    // Fallback to empty array if API fails
  }

  let popularGyms: Gym[] = []
  try {
    const allGyms = await getAllGyms()
    popularGyms = allGyms.slice(0, 5)
  } catch (error) {
    console.error('Failed to load popular gyms:', error)
    // Fallback to empty array if API fails
  }

  let reviews: ReviewWithGym[] = []
  try {
    reviews = await getAllReviews(12)
    // Format dates on server side to prevent hydration mismatches
    reviews = reviews.map((review) => {
      const date = new Date(review.reviewed_at)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const formattedDate = isNaN(date.getTime())
        ? ''
        : `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
      return {
        ...review,
        formattedDate,
      }
    })
  } catch (error) {
    console.error('Failed to load reviews:', error)
    // Fallback to empty array if API fails
  }

  let recentPosts: BlogPost[] = []
  try {
    recentPosts = await getRecentBlogPosts(3)
  } catch (error) {
    console.error('Failed to load recent blog posts:', error)
    // Fallback to empty array if API fails
  }


  return (
    <div className='min-h-screen'>
      <HeroSection popularGyms={popularGyms} />
      <WhyChooseSection />
      {/* <ListingByStateSection states={states} /> */}
      <TrendingGymsSection gyms={trendingGyms} />
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
