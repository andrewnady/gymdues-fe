import { ReviewWithGym } from '@/types/gym'

import { getApiBaseUrl } from './api-config'

const API_BASE_URL = getApiBaseUrl()

export interface ReviewsPaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
  next_page_url?: string | null
  prev_page_url?: string | null
}

export interface PaginatedReviewsResponse {
  data: ReviewWithGym[]
  meta: ReviewsPaginationMeta
}

export interface ApiReview {
  id: number | string
  rate: number
  reviewer: string
  reviewed_at: string
  comment: string
  gym: {
    id: number | string
    name: string
    slug: string
    logo: string
  }
}

/**
 * Normalizes review data from API to ReviewWithGym format
 */
function normalizeReview(review: ApiReview): ReviewWithGym {
  return {
    id: String(review.id),
    reviewer: review.reviewer || 'Anonymous',
    rate: review.rate || 0,
    rating: review.rate || 0, // Alias for compatibility
    text: review.comment || '',
    reviewed_at: review.reviewed_at || new Date().toISOString(),
    gymName: review.gym?.name || 'Unknown Gym',
    gymSlug: review.gym?.slug || '',
    gym: {
      id: String(review.gym?.id),
      name: review.gym?.name || '',
      slug: review.gym?.slug || '',
      logo: review.gym?.logo || '',
    },
  }
}

/**
 * Fetches reviews from the API
 */
export async function getReviews(options?: {
  gym_slug?: string
  gym_id?: number | string
  min_rate?: number
  max_rate?: number
  page?: number
  per_page?: number
  not_null?: boolean
}): Promise<ReviewWithGym[]> {
  try {
    const params = new URLSearchParams()

    if (options?.gym_slug) {
      params.append('gym_slug', options.gym_slug)
    }
    if (options?.gym_id) {
      params.append('gym_id', String(options.gym_id))
    }
    if (options?.min_rate !== undefined) {
      params.append('min_rate', String(options.min_rate))
    }
    if (options?.max_rate !== undefined) {
      params.append('max_rate', String(options.max_rate))
    }
    if (options?.page) {
      params.append('page', String(options.page))
    }
    if (options?.per_page) {
      params.append('per_page', String(options.per_page))
    }
    if (options?.not_null) {
      params.append('not_null', String(options.not_null))
    }

    const url = `${API_BASE_URL}/api/v1/reviews${params.toString() ? `?${params.toString()}` : ''}`

    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Handle paginated response
    if (data.data && Array.isArray(data.data)) {
      return data.data.map(normalizeReview)
    }

    // Handle direct array response
    if (Array.isArray(data)) {
      return data.map(normalizeReview)
    }

    // Handle Laravel pagination format
    if (data.data && Array.isArray(data.data)) {
      return data.data.map(normalizeReview)
    }

    return []
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}

/**
 * Fetches all reviews (with pagination if needed)
 */
export async function getAllReviews(maxReviews: number = 12): Promise<ReviewWithGym[]> {
  try {
    const reviews = await getReviews({
      per_page: maxReviews,
      min_rate: 5,
      max_rate: 5,
      not_null: true,
      page: 1,
    })

    // Sort by date (most recent first) and limit
    return reviews
      .sort((a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime())
      .slice(0, maxReviews)
  } catch (error) {
    console.error('Error fetching all reviews:', error)
    // Return empty array on error to prevent page crash
    return []
  }
}

/**
 * Fetches reviews for a specific gym
 */
export async function getGymReviews(
  gymSlug: string,
  maxReviews?: number,
): Promise<ReviewWithGym[]> {
  try {
    const reviews = await getReviews({
      gym_slug: gymSlug,
      per_page: maxReviews || 50,
      page: 1,
    })

    // Sort by date (most recent first) and limit
    if (maxReviews) {
      return reviews
        .sort((a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime())
        .slice(0, maxReviews)
    }

    return reviews.sort(
      (a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime(),
    )
  } catch (error) {
    console.error('Error fetching gym reviews:', error)
    return []
  }
}
