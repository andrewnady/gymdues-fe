import Link from 'next/link'
import {
  Dumbbell,
  TrendingUp,
  Users,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { GymAutocompleteSearch } from '@/components/gym-autocomplete-search'
import { getStatesWithCounts, getAllReviews } from '@/data/mock-gyms'
import { getTrendingGyms, getAllGyms } from '@/lib/gyms-api'
import { getRecentBlogPosts } from '@/lib/blog-api'
import { BlogPost } from '@/types/blog'
import { GymCard } from '@/components/gym-card'
import { Gym } from '@/types/gym'
import { ReviewsCarousel } from '@/components/reviews-carousel'
import { BlogCard } from '@/components/blog-card'
import { NewsletterSubscription } from '@/components/newsletter-subscription'

export default async function Home() {
  const states = getStatesWithCounts()
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
  
  const reviews = getAllReviews(12)
  let recentPosts: BlogPost[] = []
  try {
    recentPosts = await getRecentBlogPosts(3)
  } catch (error) {
    console.error('Failed to load recent blog posts:', error)
    // Fallback to empty array if API fails
  }

  // City skyline images mapping
  const cityImages: Record<string, string> = {
    NY: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&q=80', // New York
    CA: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&q=80', // Los Angeles
    TX: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&h=600&fit=crop&q=80', // Texas
    FL: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop&q=80', // Miami
    IL: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80', // Chicago
  }

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section 
        className='relative pt-32 pb-24 md:pt-48 md:pb-40 bg-cover bg-center bg-no-repeat min-h-[600px] md:min-h-[700px] flex items-center -mt-16'
        style={{
          backgroundImage: 'url(/images/bg-header.jpg)',
        }}
      >
        <div className='absolute inset-0 bg-black/50' />
        <div className='container mx-auto px-4 relative z-10 w-full pt-16'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white'>
              Find Your Perfect Gym
            </h1>
            <p className='text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto'>
              The best way to find yourself in the service of others.
            </p>

            {/* Search Bar */}
            <div className='max-w-4xl mx-auto mb-8'>
              <GymAutocompleteSearch />
            </div>

            {/* Most Popular Gyms and Prices */}
            <div className='text-white/90 mb-4'>
              <p className='text-sm md:text-base mb-4'>Most Popular Gyms and Prices</p>
              <div className='flex flex-wrap justify-center gap-3'>
                {popularGyms.length > 0 ? (
                  popularGyms.map((gym) => {
                    const lowestPrice = gym.pricing && gym.pricing.length > 0
                      ? Math.min(...gym.pricing.map((plan) => plan.price || 0))
                      : null
                    return (
                      <Link
                        key={gym.id}
                        href={`/gyms/${gym.slug}`}
                        className='bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 h-12 px-6 rounded-full flex items-center gap-2 transition-colors'
                      >
                        <span className='font-medium'>{gym.name}</span>
                        {lowestPrice !== null && (
                          <span className='text-white/80 text-sm'>
                            ${lowestPrice.toFixed(0)}/mo
                          </span>
                        )}
                      </Link>
                    )
                  })
                ) : (
                  <p className='text-white/70 text-sm'>Loading popular gyms...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-background'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-2'>Why Choose GymDues</h2>
            <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
              Everything you need to find and compare fitness centers
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
                <Dumbbell className='h-8 w-8 text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Comprehensive Listings</h3>
              <p className='text-muted-foreground'>
                Browse hundreds of gyms with detailed information about facilities, plans, and
                amenities.
              </p>
            </div>
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
                <TrendingUp className='h-8 w-8 text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Compare Plans</h3>
              <p className='text-muted-foreground'>
                Easily compare membership plans, prices, and features to find the best fit for your
                budget.
              </p>
            </div>
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
                <Users className='h-8 w-8 text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Real Reviews</h3>
              <p className='text-muted-foreground'>
                Read authentic reviews from members to make informed decisions about your fitness
                journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Listing by State Section */}
      <section className='py-20 bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-12'>
            <div>
              <h2 className='text-3xl md:text-4xl font-bold mb-2'>Browse Gyms By State</h2>
              <p className='text-muted-foreground text-lg'>
                A selection of listing verified for quality.
              </p>
            </div>
            <Link
              href='/gyms'
              className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-4 md:mt-0'
            >
              Explore More
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {states.slice(0, 4).map((state) => (
              <Link
                key={state.state}
                href={`/gyms?state=${state.state}`}
                className='group relative overflow-hidden rounded-xl h-64 md:h-80 cursor-pointer'
              >
                <div
                  className='absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110'
                  style={{
                    backgroundImage: `url(${cityImages[state.state] || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&q=80'})`,
                  }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-6'>
                  <div className='flex items-center gap-2 mb-2'>
                    <MapPin className='h-5 w-5 text-orange-500' />
                    <h3 className='text-2xl font-bold text-white'>{state.stateName}</h3>
                  </div>
                  <p className='text-white/90 text-sm'>
                    {state.count} {state.count === 1 ? 'Gym' : 'Gyms'} available
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Gyms Section */}
      <section className='py-20 bg-background'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-12'>
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <h2 className='text-3xl md:text-4xl font-bold'>Trending Gyms</h2>
              </div>
              <p className='text-muted-foreground text-lg'>
                Discover the most popular and highly-rated fitness centers
              </p>
            </div>
            <Link
              href='/gyms'
              className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-4 md:mt-0'
            >
              View All Gyms
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {trendingGyms.map((gym) => (
              <GymCard key={gym.id} gym={gym} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Carousel Section */}
      <section className='py-20 bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center justify-center gap-2 mb-4'>
              <h2 className='text-3xl md:text-4xl font-bold'>What Our Members Say</h2>
            </div>
            <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
              Real reviews from real members. See what people are saying about their gym
              experiences.
            </p>
          </div>

          {reviews.length > 0 && (
            <div className='max-w-7xl mx-auto'>
              <ReviewsCarousel reviews={reviews} />
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className='py-20 bg-background'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-12'>
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <h2 className='text-3xl md:text-4xl font-bold'>Latest from Our Blog</h2>
              </div>
              <p className='text-muted-foreground text-lg'>
                Expert tips, guides, and insights to help you on your fitness journey
              </p>
            </div>
            <Link
              href='/blog'
              className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-4 md:mt-0'
            >
              View All Posts
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='py-20 bg-primary/5'>
        <div className='container mx-auto px-4'>
          <NewsletterSubscription />
        </div>
      </section>
    </div>
  )
}
