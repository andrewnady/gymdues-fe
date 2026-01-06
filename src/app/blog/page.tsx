import type { Metadata } from 'next'
import { getAllBlogPosts } from '@/lib/blog-api'
import { BlogCard } from '@/components/blog-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { ReadMoreText } from '@/components/read-more-text'

export const metadata: Metadata = {
  title: 'Gym Pricing Guides & Membership Tips | Gymdues Blog',
  description:
    'Guides on gym membership costs, plan comparisons, hidden fees, and savings tips—updated regularly for the USA and worldwide.',
}

export default async function BlogPage() {
  let posts: BlogPost[] = []
  try {
    posts = await getAllBlogPosts()
  } catch (error) {
    console.error('Failed to load blog posts:', error)
    // Fallback to empty array if API fails
  }

  return (
    <div className='min-h-screen py-12'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 text-center'>
          <h1 className='text-4xl font-bold mb-4'>
            GymDues Blog: Gym Prices, Plans & Membership Guides
          </h1>
          <ReadMoreText className='text-muted-foreground text-lg max-w-2xl mx-auto mb-6'>
            Welcome to the GymDues Blog—your go-to place for clear, practical guides on gym
            memberships, pricing, and how to get the best value. We break down what people search
            for most, like <strong>la fitness prices</strong>,{' '}
            <strong>anytime fitness prices</strong>, <strong>24 hour fitness prices</strong>, and
            premium options such as <strong>lifetime gym membership cost</strong>, so you can
            understand real costs beyond the &quot;starting at&quot; rate. You&apos;ll also find
            comparisons and tips on common fees, plan tiers, and savings strategies—plus deep dives
            into trending gyms like <strong>ufc gym prices</strong>,{' '}
            <strong>pure barre prices</strong>, and <strong>orangetheory membership cost</strong>
            —so you can choose confidently before you join.
          </ReadMoreText>
          <div className='max-w-md mx-auto'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
              <Input type='text' placeholder='Search blog posts...' className='pl-10' />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>No blog posts found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
