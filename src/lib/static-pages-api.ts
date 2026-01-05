const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export interface StaticPage {
  id: number
  title: string
  slug: string
  content: string
  meta_title?: string
  meta_description?: string
  created_at?: string
  updated_at?: string
}

export interface StaticPageListItem {
  id: number
  title: string
  slug: string
  meta_title?: string
  meta_description?: string
}

/**
 * Fetches all published static pages
 */
export async function getAllStaticPages(): Promise<StaticPageListItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/static-pages`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch static pages: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching static pages:', error)
    return []
  }
}

/**
 * Fetches a single static page by slug
 */
export async function getStaticPageBySlug(slug: string): Promise<StaticPage | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/static-pages/${slug}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch static page: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching static page:', error)
    return null
  }
}

