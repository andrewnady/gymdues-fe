import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug, getAllBlogPosts } from '@/data/mock-blog';
import { getTrendingGyms } from '@/data/mock-gyms';
import { Separator } from '@/components/ui/separator';
import { Calendar, ArrowLeft } from 'lucide-react';
import { GymCard } from '@/components/gym-card';
import { CommentForm } from '@/components/comment-form';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredGyms = getTrendingGyms(3);

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - 8 columns */}
          <div className="lg:col-span-8 space-y-8">
            {/* Post Image */}
            <div className="relative h-64 md:h-96 w-full bg-muted rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Post Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <Separator />

            {/* Author Section */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-center gap-4">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-semibold mb-1">About the Author</h3>
                  <p className="text-sm text-muted-foreground">{post.author.name}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Comment Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Leave a Comment</h2>
              <CommentForm />
            </div>
          </div>

          {/* Right Column - 4 columns */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Featured Gyms</h2>
              <div className="space-y-6">
                {featuredGyms.map((gym) => (
                  <GymCard key={gym.id} gym={gym} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

