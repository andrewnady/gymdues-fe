import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Dumbbell, TrendingUp, Users, Award, MapPin, ArrowRight, Flame, Star, BookOpen } from 'lucide-react';
import { getStatesWithCounts, getTrendingGyms, getAllReviews } from '@/data/mock-gyms';
import { getRecentBlogPosts } from '@/data/mock-blog';
import { GymCard } from '@/components/gym-card';
import { ReviewsCarousel } from '@/components/reviews-carousel';
import { BlogCard } from '@/components/blog-card';
import { NewsletterSubscription } from '@/components/newsletter-subscription';

export default function Home() {
  const states = getStatesWithCounts();
  const trendingGyms = getTrendingGyms(3);
  const reviews = getAllReviews(12);
  const recentPosts = getRecentBlogPosts(3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Gym
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover the best fitness centers near you. Compare plans, read reviews, and join the gym that fits your lifestyle.
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for a gym by name, location, or amenities..."
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button size="lg" className="h-12 px-8" asChild>
                <Link href="/gyms">Search</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Listings</h3>
              <p className="text-muted-foreground">
                Browse hundreds of gyms with detailed information about facilities, plans, and amenities.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compare Plans</h3>
              <p className="text-muted-foreground">
                Easily compare membership plans, prices, and features to find the best fit for your budget.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Reviews</h3>
              <p className="text-muted-foreground">
                Read authentic reviews from members to make informed decisions about your fitness journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Listing by State Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse Gyms by State</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find fitness centers in your state. Explore gyms across different locations.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {states.map((state) => (
              <Card key={state.state} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <Link href={`/gyms?state=${state.state}`} className="block">
                    <div className="flex items-center justify-center mb-3">
                      <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-center mb-1 group-hover:text-primary transition-colors">
                      {state.stateName}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {state.count} {state.count === 1 ? 'gym' : 'gyms'}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/gyms">
                Explore More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Gyms Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Trending Gyms</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the most popular and highly-rated fitness centers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {trendingGyms.map((gym) => (
              <GymCard key={gym.id} gym={gym} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/gyms">
                View All Gyms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Carousel Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 text-primary fill-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">What Our Members Say</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real reviews from real members. See what people are saying about their gym experiences.
            </p>
          </div>
          
          {reviews.length > 0 && (
            <div className="max-w-7xl mx-auto">
              <ReviewsCarousel reviews={reviews} />
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Latest from Our Blog</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Expert tips, guides, and insights to help you on your fitness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <NewsletterSubscription />
        </div>
      </section>
    </div>
  );
}
