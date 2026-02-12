import { BlogPost } from '@/types/blog'
import { getApiBaseUrl, transformApiUrl, transformApiResponse } from './api-config'

const API_BASE_URL = getApiBaseUrl()

// Placeholder image for posts without featured images
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop&q=80'

export interface ApiError {
  message: string
  status?: number
}

/**
 * Normalizes blog post data from API to ensure all required fields are present
 * Handles different field name variations and calculates missing values
 */
function normalizeBlogPost(post: Record<string, unknown>): BlogPost {
  // Handle author - check for various field name variations
  let author: { id: number; name: string; avatar?: string } = {
    id: 0,
    name: '',
    avatar: undefined,
  }

  if (post.author && typeof post.author === 'object') {
    const authorObj = post.author as Record<string, unknown>
    author = {
      id: Number(authorObj.id || authorObj.author_id || 0),
      name: (authorObj.name || authorObj.author_name || '') as string,
      avatar: (authorObj.avatar || authorObj.author_avatar) as string | undefined,
    }
  } else if (post.author_name) {
    author = {
      id: Number(post.author_id || 0),
      name: post.author_name as string,
      avatar: post.author_avatar as string | undefined,
    }
  }

  // Handle featured_images - use placeholder if empty
  let featuredImages: { id: number; path: string; alt: string }[] = []
  if (post.featured_images && Array.isArray(post.featured_images) && post.featured_images.length > 0) {
    featuredImages = (post.featured_images as Array<Record<string, unknown>>).map((img) => ({
      id: Number(img.id || 0),
      path: transformApiUrl(img.path || img.url || ''),
      alt: String(img.alt || ''),
    }))
  } else if (post.coverImage || post.cover_image || post.image) {
    // Fallback to old format - convert to featured_images array
    featuredImages = [
      {
        id: 0,
        path: transformApiUrl(post.coverImage || post.cover_image || post.image),
        alt: String(post.title || ''),
      },
    ]
  } else {
    // Use placeholder image if no featured image
    featuredImages = [
      {
        id: 0,
        path: PLACEHOLDER_IMAGE,
        alt: String(post.title || 'Blog post image'),
      },
    ]
  }

  // Handle categories
  let categories: { id: number; name: string; slug: string }[] = []
  if (post.categories && Array.isArray(post.categories)) {
    categories = (post.categories as Array<Record<string, unknown>>).map((cat) => ({
      id: Number(cat.id || 0),
      name: String(cat.name || ''),
      slug: String(cat.slug || ''),
    }))
  } else if (post.category) {
    // Fallback to old format - convert to categories array
    categories = [
      {
        id: 0,
        name: String(post.category),
        slug: String(post.category).toLowerCase().replace(/\s+/g, '-'),
      },
    ]
  }

  return {
    id: String(post.id || post.post_id || ''),
    slug: String(post.slug || ''),
    title: String(post.title || ''),
    excerpt: String(post.excerpt || post.description || ''),
    summary: String(post.summary || post.excerpt || post.description || ''),
    content: String(post.content || post.body || ''),
    author,
    published_at: String(post.published_at || post.publishedAt || post.created_at || ''),
    updated_at: post.updated_at || post.updatedAt ? String(post.updated_at || post.updatedAt) : undefined,
    featured_images: featuredImages,
    categories,
  } as BlogPost
}

/**
 * Normalizes an array of blog posts
 */
function normalizeBlogPosts(posts: Record<string, unknown>[]): BlogPost[] {
  return posts.map(normalizeBlogPost)
}

/**
 * Fetches all blog posts from the API
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/posts`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status} ${response.statusText}`)
    }

    let data = await response.json()
    
    // Transform URLs in the response (replace nginx with localhost:8080)
    data = transformApiResponse(data)

    // Handle different response formats
    let posts: Record<string, unknown>[] = []

    if (data.data && Array.isArray(data.data)) {
      posts = data.data as Record<string, unknown>[]
    } else if (data.posts && Array.isArray(data.posts)) {
      posts = data.posts as Record<string, unknown>[]
    } else if (Array.isArray(data)) {
      posts = data as Record<string, unknown>[]
    } else {
      throw new Error('Invalid response format from API')
    }

    // Normalize all posts
    const normalizedPosts = normalizeBlogPosts(posts)

    // Sort by published date (newest first)
    return normalizedPosts.sort((a, b) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    throw error
  }
}

/**
 * Fetches a single blog post by slug from the API
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Try the slug endpoint first
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/posts/${slug}`, {
        next: { revalidate: 60 },
      })

      if (response.ok) {
        let data = await response.json()
        
        // Transform URLs in the response
        data = transformApiResponse(data)

        // Handle different response formats
        let post: Record<string, unknown> | null = null
        if (data.data) {
          post = data.data as Record<string, unknown>
        } else if (data.post) {
          post = data.post as Record<string, unknown>
        } else {
          post = data as Record<string, unknown>
        }

        // Normalize the post data
        return normalizeBlogPost(post)
      }

      // If 404, return null
      if (response.status === 404) {
        return null
      }
    } catch {
      // If slug endpoint doesn't exist or fails, fall back to fetching all and filtering
      console.warn('Slug endpoint not available, falling back to filtering all posts')
    }

    // Fallback: fetch all posts and filter by slug
    const allPosts = await getAllBlogPosts()
    const post = allPosts.find((p) => p.slug === slug)
    return post || null
  } catch (error) {
    console.error('Error fetching blog post by slug:', error)
    throw error
  }
}

/**
 * Fetches recent blog posts (limited)
 */
export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  try {
    const allPosts = await getAllBlogPosts()
    return allPosts.slice(0, limit)
  } catch (error) {
    console.error('Error fetching recent blog posts:', error)
    throw error
  }
}

/**
 * Fetches blog posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const allPosts = await getAllBlogPosts()
    return allPosts.filter((post) => 
      post.categories.some((cat) => cat.name.toLowerCase() === category.toLowerCase() || cat.slug.toLowerCase() === category.toLowerCase())
    )
  } catch (error) {
    console.error('Error fetching blog posts by category:', error)
    throw error
  }
}

