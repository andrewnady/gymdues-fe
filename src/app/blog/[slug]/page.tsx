import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog-api';
import { getTrendingGyms } from '@/lib/gyms-api';
import { Separator } from '@/components/ui/separator';
import { Calendar, ArrowLeft } from 'lucide-react';
import { GymCard } from '@/components/gym-card';
import { BlogCommentsSection } from '@/components/blog-comments-section';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found - GymDues',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com';
  const postUrl = `${siteUrl}/blog/${slug}`;
  const featuredImage = post.featured_images?.length > 0 
    ? (post.featured_images[0].path.startsWith('http') 
        ? post.featured_images[0].path 
        : `${siteUrl}${post.featured_images[0].path}`)
    : `${siteUrl}/images/bg-header.jpg`;

  const metadata: Metadata = {
    title: post.title,
    description: post.excerpt || post.summary,
    alternates: {
      canonical: postUrl,
      languages: {
        'en-US': postUrl,
        'x-default': postUrl,
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
      title: post.title,
      description: post.excerpt || post.summary,
      url: postUrl,
      siteName: 'GymDues',
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: post.featured_images?.length > 0 ? post.featured_images[0].alt : post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || post.published_at,
      authors: [post.author.name],
      ...(post.categories && post.categories.length > 0 && {
        tags: post.categories.map(cat => cat.name),
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.summary,
      images: [featuredImage],
      creator: '@gymdues',
      site: '@gymdues',
    },
  };

  // Add published and updated date meta tags
  const otherTags: Record<string, string> = {};
  if (post.published_at) {
    otherTags['article:published_time'] = new Date(post.published_at).toISOString();
  }
  if (post.updated_at && post.updated_at !== post.published_at) {
    otherTags['article:modified_time'] = new Date(post.updated_at).toISOString();
  }
  if (Object.keys(otherTags).length > 0) {
    metadata.other = otherTags;
  }

  return metadata;
}

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredGyms = await getTrendingGyms(3);

  // Get site URL from environment or default to production
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com';
  const postUrl = `${siteUrl}/blog/${slug}`;
  const featuredImage = post.featured_images?.length > 0 
    ? post.featured_images[0].path.startsWith('http') 
      ? post.featured_images[0].path 
      : `${siteUrl}${post.featured_images[0].path}`
    : `${siteUrl}/images/bg-header.jpg`;

  // Article Schema (Schema.org)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.summary,
    image: featuredImage,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.avatar && {
        image: post.author.avatar.startsWith('http') 
          ? post.author.avatar 
          : `${siteUrl}${post.author.avatar}`,
      }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'GymDues',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.svg`,
      },
    },
    // Main Entity Of Page - The canonical URL of the article page
    mainEntityOfPage: postUrl,
    articleSection: post.categories?.map(cat => cat.name).join(', ') || 'Fitness',
    keywords: post.categories?.map(cat => cat.name).join(', ') || 'gym, fitness, membership',
    ...(post.updated_at && post.updated_at !== post.published_at && {
      dateModified: post.updated_at,
    }),
  };

  // BlogPosting Schema (Schema.org)
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.summary,
    image: featuredImage,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.avatar && {
        image: post.author.avatar.startsWith('http') 
          ? post.author.avatar 
          : `${siteUrl}${post.author.avatar}`,
      }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'GymDues',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.svg`,
      },
    },
    // Main Entity Of Page - The canonical URL of the article page
    mainEntityOfPage: postUrl,
    articleSection: post.categories?.map(cat => cat.name).join(', ') || 'Fitness',
    keywords: post.categories?.map(cat => cat.name).join(', ') || 'gym, fitness, membership',
    ...(post.categories && post.categories.length > 0 && {
      articleSection: post.categories.map(cat => cat.name),
    }),
  };

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />
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
                {new Date(post.published_at).toLocaleDateString('en-US', {
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
                src={post.featured_images?.length > 0 ? post.featured_images[0].path : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop&q=80'}
                alt={post.featured_images?.length > 0 ? post.featured_images[0].alt : post.title}
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

            {/* Comments Section */}
            <BlogCommentsSection postSlug={slug} />
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

