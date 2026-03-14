import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { BlogCard } from '@/components/blog-card'
import { ReadMoreText } from '@/components/read-more-text'

interface BlogSectionProps {
  posts: BlogPost[]
}

export function BlogSection({ posts }: BlogSectionProps) {
  return (
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
              <strong>pure barre prices</strong>, and <strong>orangetheory membership cost</strong>,
              plus deeper dives into specialty training like <strong>ufc gym prices</strong>,{' '}
              <strong>ufc gym membership cost</strong>, and{' '}
              <strong>fit body boot camp cost per month</strong>. If you&apos;re trying to choose a
              membership, avoid hidden fees, or find the best deal in your city, this is where
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
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

