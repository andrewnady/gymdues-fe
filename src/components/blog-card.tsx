import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from '@/types/blog'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar } from 'lucide-react'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  console.log('post', post)
  return (
    <Link href={`/blog/${post.slug}`} className='block'>
      <Card className='overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer'>
        <div className='relative h-48 w-full bg-muted'>
          <Image
            src={
              post.featured_images?.length > 0
                ? post.featured_images[0].path
                : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop&q=80'
            }
            alt={post.featured_images[0]?.alt || post.title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
        <CardHeader className='flex-1'>
          {/* <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{post.category}</Badge>
          </div> */}
          <CardTitle className='text-xl mb-2 line-clamp-2'>{post.title}</CardTitle>
          <CardDescription className='line-clamp-3'>{post.excerpt}</CardDescription>
        </CardHeader>
        <CardContent className='flex-1'>
          {/* <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div> */}
          <div className='flex items-center justify-between gap-4 text-sm text-muted-foreground'>
            {/* <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div> */}
            {/* <div className='flex items-center gap-1'>
              <Calendar className='h-4 w-4' />
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div> */}
            {/* <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div> */}
          </div>
        </CardContent>
        <CardFooter>
          <div className='flex justify-between w-full'>
            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
              <Calendar className='h-4 w-4' />
              <span>
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <span className='text-primary hover:underline font-medium text-sm'>Read More →</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
