import Link from 'next/link'
import type { Metadata } from 'next'
import { Dumbbell, TrendingUp, Users, MapPin, ArrowRight } from 'lucide-react'
import { GymAutocompleteSearch } from '@/components/gym-autocomplete-search'
import { getTrendingGyms, getAllGyms, getStatesWithCounts } from '@/lib/gyms-api'
import { getAllReviews } from '@/lib/reviews-api'
import { getRecentBlogPosts } from '@/lib/blog-api'
import { BlogPost } from '@/types/blog'
import { GymCard } from '@/components/gym-card'
import { Gym, ReviewWithGym, StateWithCount } from '@/types/gym'
import { ReviewsCarousel } from '@/components/reviews-carousel'
import { BlogCard } from '@/components/blog-card'
import { NewsletterSubscription } from '@/components/newsletter-subscription'
import { ReadMoreText } from '@/components/read-more-text'

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
              Best Gyms in the World
            </h1>
            <ReadMoreText className='text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto'>
              <p>
                Access the latest membership pricing insights for the world&apos;s most searched
                gyms and studios—like <strong>la fitness membership cost</strong>,{' '}
                <strong>anytime fitness membership cost</strong>,{' '}
                <strong>24 hour fitness membership cost</strong>,{' '}
                <strong>lifetime gym membership cost</strong>,{' '}
                <strong>equinox membership cost</strong>, and{' '}
                <strong>gold&apos;s gym membership cost</strong>. We also cover high-demand regional
                and specialty brands people compare every day, including{' '}
                <strong>xsport membership cost</strong>,{' '}
                <strong>xsport fitness membership cost</strong>,{' '}
                <strong>xsport fitness price per month</strong>,{' '}
                <strong>princeton club membership cost</strong>,{' '}
                <strong>princeton club membership cost new berlin</strong>,{' '}
                <strong>newtown athletic club membership cost</strong>,{' '}
                <strong>newtown athletic club pricing</strong>, and{' '}
                <strong>nac membership cost</strong>. Go beyond basic &quot;starting at&quot;
                numbers to understand plan differences, compare cost ranges by location, and spot
                common fees—so you can choose the best-value gym confidently.
              </p>
              <p>
                Why do gym prices feel inconsistent from one place to another? Because membership
                cost is shaped by plan tiers, access level, contract length, and add-ons like
                initiation and annual fees—especially for popular searches like{' '}
                <strong>xsport membership plans</strong>, <strong>ufc gym prices</strong>,{' '}
                <strong>ufc gym membership cost</strong>, <strong>ufc gym membership plans</strong>,{' '}
                <strong>fit body boot camp cost per month</strong>,{' '}
                <strong>fit body boot camp price per month</strong>,{' '}
                <strong>pure barre membership cost</strong>, <strong>pure barre prices</strong>,{' '}
                <strong>orangetheory membership cost</strong>, <strong>nysc membership cost</strong>
                , <strong>bay club membership cost</strong>,{' '}
                <strong>fitness connection membership prices</strong>,{' '}
                <strong>fitness 19 membership cost</strong>,{' '}
                <strong>blink fitness gray membership cost</strong>,{' '}
                <strong>jetts membership cost</strong>, and{' '}
                <strong>crunch fitness annual fee</strong>. With clear comparisons and pricing
                context, you can benchmark gyms worldwide and pick the right membership without
                surprises.
              </p>
            </ReadMoreText>

            {/* Search Bar */}
            <div className='max-w-4xl mx-auto mb-8'>
              <GymAutocompleteSearch />
            </div>

            {/* Most Popular Gyms and Prices */}
            <div className='text-white/90 mb-4'>
              <h2 className='text-3xl md:text-4xl font-bold mb-2'>Most Popular Gyms and Prices</h2>
              <ReadMoreText className='text-muted-background text-lg max-w-4xl mx-auto mb-4'>
                <p>
                  Under Most Popular Gyms and Prices, we break down the real-world costs people
                  search for most—so you can compare memberships across major chains and premium
                  clubs without guesswork. Explore pricing topics like{' '}
                  <strong>la fitness prices</strong> and <strong>la fitness membership cost</strong>
                  , along with <strong>anytime fitness prices</strong> and{' '}
                  <strong>anytime fitness membership cost</strong>, plus{' '}
                  <strong>24 hour fitness prices</strong> and{' '}
                  <strong>24 hour fitness membership cost</strong>. If you&apos;re researching
                  higher-end options, we also cover <strong>lifetime gym membership cost</strong>{' '}
                  and <strong>bay club membership cost</strong>, and for big-city memberships
                  you&apos;ll find guides for <strong>nysc membership cost</strong> and{' '}
                  <strong>new york sports club membership cost</strong>. For boutique and
                  studio-style training, compare <strong>pure barre membership cost</strong> and{' '}
                  <strong>pure barre prices</strong>, <strong>orangetheory membership cost</strong>,
                  and combat-focused options like <strong>ufc gym prices</strong>,{' '}
                  <strong>ufc gym membership cost</strong>, and{' '}
                  <strong>title boxing club prices</strong>.
                </p>
                <p>
                  Because gym pricing isn&apos;t just &quot;one monthly number,&quot; we also
                  highlight what affects your total—plan tiers, access levels, enrollment fees, and
                  annual fees—using the same high-demand comparisons people make, such as{' '}
                  <strong>xsport membership cost</strong>,{' '}
                  <strong>xsport fitness membership cost</strong>,{' '}
                  <strong>xsport fitness price per month</strong>,{' '}
                  <strong>xsport membership plans</strong>, and regional favorites like{' '}
                  <strong>princeton club membership cost</strong> and{' '}
                  <strong>newtown athletic club membership cost</strong> (including{' '}
                  <strong>newtown athletic club pricing</strong> and{' '}
                  <strong>nac membership cost</strong>). The result is a faster, clearer way to
                  benchmark popular gyms and choose the best-value membership for your city and
                  training style.
                </p>
              </ReadMoreText>
              <div className='flex flex-wrap justify-center gap-3'>
                {popularGyms.length > 0 ? (
                  popularGyms.map((gym) => {
                    const lowestPrice =
                      gym.pricing && gym.pricing.length > 0
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
            <ReadMoreText className='text-muted-foreground text-lg max-w-4xl mx-auto'>
              <p>
                For Why Choose GymDues, we make it easy to find the right gym and understand the
                real cost before you commit. Instead of jumping between dozens of sites, GymDues
                brings together pricing-focused pages for the memberships people search for
                most—like <strong>la fitness membership cost</strong>,{' '}
                <strong>anytime fitness membership cost</strong>,{' '}
                <strong>24 hour fitness membership cost</strong>,{' '}
                <strong>lifetime gym membership cost</strong>,{' '}
                <strong>bay club membership cost</strong>, and <strong>nysc membership cost</strong>
                —so you can compare value quickly and confidently. You&apos;ll also find detailed
                breakdowns for popular regional and specialty gyms, including{' '}
                <strong>xsport membership cost</strong>,{' '}
                <strong>xsport fitness membership cost</strong>,{' '}
                <strong>princeton club membership cost</strong>,{' '}
                <strong>newtown athletic club membership cost</strong>, and training-focused options
                like <strong>ufc gym prices</strong>, <strong>ufc gym membership cost</strong>, and{' '}
                <strong>title boxing club prices</strong>.
              </p>
              <p>
                GymDues goes beyond a simple &quot;monthly price&quot; by helping you compare plans
                and spot common add-ons (enrollment, annual fees, tiers, and perks) across brands—so
                searches like <strong>xsport membership plans</strong>,{' '}
                <strong>fitness connection membership prices</strong>,{' '}
                <strong>fitness 19 membership cost</strong>,{' '}
                <strong>pure barre membership cost</strong>, and{' '}
                <strong>orangetheory membership cost</strong> don&apos;t turn into surprises at
                checkout. And with real reviews and clear comparisons, you can choose the best gym
                for your location, goals, and budget—without wasting time or overpaying.
              </p>
            </ReadMoreText>
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
          <div className='flex flex-col md:flex-row md:justify-between mb-12 gap-4'>
            <div>
              <h2 className='text-3xl md:text-4xl font-bold mb-2'>Browse Gyms By State</h2>
              <ReadMoreText className='text-muted-foreground text-lg'>
                Start your search locally and find the best gym options near you with{' '}
                <strong>Browse Gyms By State</strong>. Instead of guessing which clubs are available
                in your area, you can explore verified listings by state and quickly compare what
                matters most—amenities, location, and especially pricing. Whether you&apos;re
                researching <strong>la fitness membership cost</strong>,{' '}
                <strong>anytime fitness membership cost</strong>,{' '}
                <strong>24 hour fitness membership cost</strong>, or city-focused memberships like{' '}
                <strong>nysc membership cost</strong> and{' '}
                <strong>new york sports club membership cost</strong>, this section helps you narrow
                down choices fast and land on the gyms that match your budget and training goals.
              </ReadMoreText>
            </div>
            <Link
              href='/gyms'
              className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-4 md:mt-0 text-nowrap'
            >
              Explore More
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {states.slice(0, 4).map((state) => (
              <Link
                key={state.state}
                href={`/gyms#state=${state.state}`}
                className='group relative overflow-hidden rounded-xl h-64 md:h-80 cursor-pointer'
              >
                <div
                  className='absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110'
                  style={{
                    backgroundImage: `url(${
                      cityImages[state.state] ||
                      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&q=80'
                    })`,
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
          <div className='flex flex-col md:flex-row md:justify-between mb-12 gap-4'>
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <h2 className='text-3xl md:text-4xl font-bold'>Trending Gyms</h2>
              </div>
              <ReadMoreText className='text-muted-foreground text-lg'>
                Discover the most popular fitness centers people are searching for right now in
                Trending Gyms—and see what they typically cost before you waste time touring.
                Compare pricing interest across big-name brands like{' '}
                <strong>24 hour fitness prices</strong>, <strong>corepower yoga prices</strong>, and{' '}
                <strong>curves prices</strong>, plus plan-related searches like{' '}
                <strong>la fitness prices</strong>, <strong>anytime fitness prices</strong>, and{' '}
                <strong>pure barre prices</strong>. From high-intensity training and boxing to
                boutique fitness, we highlight the gyms gaining traction and connect you to the
                pricing details behind searches like <strong>orangetheory membership cost</strong>,{' '}
                <strong>ufc gym prices</strong>, and <strong>title boxing club prices</strong>—so
                you can follow what&apos;s trending and still make a smart value decision.
              </ReadMoreText>
            </div>
            <Link
              href='/gyms'
              className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-4 md:mt-0 text-nowrap'
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
              <h2 className='text-3xl md:text-4xl font-bold'>What Gymdues Members Say</h2>
            </div>
            <ReadMoreText className='text-muted-foreground text-lg max-w-4xl mx-auto'>
              Real reviews make gym decisions easier—especially when you&apos;re comparing value,
              fees, and overall experience. In What Our Members Say, you&apos;ll see honest feedback
              from members who&apos;ve tried popular gyms and studios people search for most, like{' '}
              <strong>la fitness membership cost</strong>,{' '}
              <strong>anytime fitness membership cost</strong>,{' '}
              <strong>24 hour fitness membership cost</strong>,{' '}
              <strong>nysc membership cost</strong>, and premium options like{' '}
              <strong>lifetime gym membership cost</strong> and{' '}
              <strong>bay club membership cost</strong>. Reviews help you understand what you really
              get for the price—cleanliness, crowd levels, class quality, cancellations, and whether
              the membership feels worth it—before you commit to a plan.
            </ReadMoreText>
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
          <div className='flex flex-col md:flex-row md:justify-between mb-12 gap-4'>
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <h3 className='text-3xl md:text-4xl font-bold'>Latest from Gymdues Blog</h3>
              </div>
              <ReadMoreText className='text-muted-foreground text-lg'>
                Stay ahead of price changes and gym trends with Latest from Our Blog—quick guides
                that answer the exact questions people type into Google. We publish breakdowns and
                comparisons around high-demand searches like <strong>la fitness prices</strong>,{' '}
                <strong>anytime fitness prices</strong>, <strong>24 hour fitness prices</strong>,{' '}
                <strong>pure barre prices</strong>, and{' '}
                <strong>orangetheory membership cost</strong>, plus deeper dives into specialty
                training like <strong>ufc gym prices</strong>,{' '}
                <strong>ufc gym membership cost</strong>, and{' '}
                <strong>fit body boot camp cost per month</strong>. If you&apos;re trying to choose
                a membership, avoid hidden fees, or find the best deal in your city, this is where
                you&apos;ll get practical, up-to-date insights in minutes.
              </ReadMoreText>
            </div>
            <Link
              href='/blog'
              className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-4 md:mt-0 text-nowrap'
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
