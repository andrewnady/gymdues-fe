import type { Metadata } from 'next'
import { getTrendingGyms, getAllGyms, getStatesWithCounts } from '@/lib/gyms-api'
import { getAllReviews } from '@/lib/reviews-api'
import { getRecentBlogPosts } from '@/lib/blog-api'
import { BlogPost } from '@/types/blog'
import { Gym, ReviewWithGym, StateWithCount } from '@/types/gym'
import { NewsletterSubscription } from '@/components/newsletter-subscription'
import { HeroSection } from '@/components/hero-section'
import { WhyChooseSection } from '@/components/why-choose-section'
import { ListingByStateSection } from '@/components/listing-by-state-section'
import { TrendingGymsSection } from '@/components/trending-gyms-section'
import { ReviewsSection } from '@/components/reviews-section'
import { BlogSection } from '@/components/blog-section'

export const metadata: Metadata = {
  title: 'Gym Membership Costs & Prices (2026) | Gymdues',
  description:
    'Compare gym membership prices by brand and location. See monthly costs, plans, fees, and tips to find the best deal.',
}

export default async function Home() {
  let states: StateWithCount[] = []
  try {
    states = await getStatesWithCounts()
  } catch (error) {
    console.error('Failed to load states:', error)
    // Fallback to empty array if API fails
  }

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
      <ListingByStateSection states={states} />
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
