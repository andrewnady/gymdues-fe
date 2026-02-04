import type { MetadataRoute } from 'next'
import { getPaginatedGyms } from '@/lib/gyms-api'
import { getAllBlogPosts } from '@/lib/blog-api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'
const GYMS_PER_SITEMAP = 500

/** Static pages to include in the main sitemap slice */
const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  { url: `${BASE_URL}/gyms`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
]

export async function generateSitemaps() {
  try {
    const { meta } = await getPaginatedGyms({ page: 1, perPage: GYMS_PER_SITEMAP })
    const totalGyms = meta.total
    const gymSitemapCount = Math.ceil(totalGyms / GYMS_PER_SITEMAP)

    const sitemaps: { id: string }[] = [{ id: 'static' }]
    for (let i = 0; i < gymSitemapCount; i++) {
      sitemaps.push({ id: String(i) })
    }
    return sitemaps
  } catch {
    // API unreachable at build/time of request – return only static sitemap so build succeeds
    return [{ id: 'static' }]
  }
}

export default async function sitemap(
  props: { id: Promise<string> }
): Promise<MetadataRoute.Sitemap> {
  const id = await props.id

  if (id === 'static') {
    let blogUrls: MetadataRoute.Sitemap = []
    try {
      const blogPosts = await getAllBlogPosts()
      blogUrls = blogPosts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    } catch {
      // Blog API unreachable – still return static pages
    }
    return [...STATIC_PAGES, ...blogUrls]
  }

  const sliceIndex = Number(id)
  const page = sliceIndex + 1
  try {
    const { gyms } = await getPaginatedGyms({ page, perPage: GYMS_PER_SITEMAP })
    return gyms.map((gym) => ({
      url: `${BASE_URL}/gyms/${gym.slug}`,
      lastModified: gym.updated_at ? new Date(gym.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    return []
  }
}
