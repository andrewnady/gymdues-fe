import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog-api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

/** Skip external API calls during CI/build so the build completes without waiting on the CMS */
const SKIP_SITEMAP_APIS = process.env.CI === 'true'

/** Static pages only (home, gyms index, blog index, about, contact, legal) */
const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  { url: `${BASE_URL}/gyms`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/privacy-policy`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/terms-of-service`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
]

export async function generateSitemaps() {
  return [{ id: 'static' }, { id: 'blog' }]
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id

  if (id === 'static') {
    return STATIC_PAGES
  }

  if (id === 'blog') {
    if (SKIP_SITEMAP_APIS) {
      return []
    }
    try {
      const blogPosts = await getAllBlogPosts()
      return blogPosts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    } catch {
      return []
    }
  }

  return []
}
