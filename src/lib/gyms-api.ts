import { Gym } from '@/types/gym'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'

export interface ApiError {
  message: string
  status?: number
}

/**
 * Normalizes gym data from API to ensure all required fields are present
 * Handles different field name variations and calculates missing values
 */
function normalizeGym(gym: Record<string, unknown>): Gym {
  // Handle reviewCount - check for various field name variations
  let reviewCount = (gym.reviewCount || gym.review_count || gym.reviews_count || gym.reviewsCount) as number | undefined

  // If reviewCount is not provided, calculate it from reviews array
  if (reviewCount === undefined || reviewCount === null) {
    reviewCount = Array.isArray(gym.reviews) ? gym.reviews.length : 0
  }

  return {
    ...gym,
    reviewCount: Number(reviewCount) || 0,
  } as Gym
}

/**
 * Normalizes an array of gyms
 */
function normalizeGyms(gyms: Record<string, unknown>[]): Gym[] {
  return gyms.map(normalizeGym)
}

/**
 * Fetches all gyms from the API
 * @param search - Optional search term to filter gyms
 * @param state - Optional state filter
 * @param city - Optional city filter
 * @param trending - Optional trending filter (true/false)
 */
export async function getAllGyms(
  search?: string,
  state?: string,
  city?: string,
  trending?: boolean
): Promise<Gym[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/gyms`)
    if (search && search.trim()) {
      url.searchParams.append('search', search.trim())
    }
    if (state && state.trim()) {
      url.searchParams.append('state', state.trim())
    }
    if (city && city.trim()) {
      url.searchParams.append('city', city.trim())
    }
    if (trending !== undefined) {
      url.searchParams.append('trending', trending.toString())
    }
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch gyms: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Handle different response formats
    // If the API returns { data: [...] } or { gyms: [...] }, extract the array
    let gyms: Record<string, unknown>[] = []

    if (data.data && Array.isArray(data.data)) {
      gyms = data.data as Record<string, unknown>[]
    } else if (data.gyms && Array.isArray(data.gyms)) {
      gyms = data.gyms as Record<string, unknown>[]
    } else if (Array.isArray(data)) {
      gyms = data as Record<string, unknown>[]
    } else {
      throw new Error('Invalid response format from API')
    }

    // Normalize all gyms to ensure reviewCount is set
    return normalizeGyms(gyms)
  } catch (error) {
    console.error('Error fetching gyms:', error)
    throw error
  }
}

/**
 * Fetches a single gym by slug from the API
 * Falls back to fetching all gyms and filtering by slug if the slug endpoint doesn't exist
 */
export async function getGymBySlug(slug: string): Promise<Gym | null> {
  try {
    // Try the slug endpoint first
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/gyms/${slug}`, {
        next: { revalidate: 60 },
      })

      if (response.ok) {
        const data = await response.json()

        // Handle different response formats
        let gym: Record<string, unknown> | null = null
        if (data.data) {
          gym = data.data as Record<string, unknown>
        } else if (data.gym) {
          gym = data.gym as Record<string, unknown>
        } else {
          gym = data as Record<string, unknown>
        }

        // Normalize the gym data
        return normalizeGym(gym)
      }

      // If 404, return null
      if (response.status === 404) {
        return null
      }
    } catch {
      // If slug endpoint doesn't exist or fails, fall back to fetching all and filtering
      console.warn('Slug endpoint not available, falling back to filtering all gyms')
    }

    // Fallback: fetch all gyms and filter by slug
    const allGyms = await getAllGyms()
    const gym = allGyms.find((g) => g.slug === slug)
    return gym || null
  } catch (error) {
    console.error('Error fetching gym by slug:', error)
    throw error
  }
}

/**
 * Fetches trending gyms from the API
 */
export async function getTrendingGyms(limit?: number): Promise<Gym[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/gyms?trending=true`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch trending gyms: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Handle different response formats
    let gyms: Record<string, unknown>[] = []

    if (data.data && Array.isArray(data.data)) {
      gyms = data.data as Record<string, unknown>[]
    } else if (data.gyms && Array.isArray(data.gyms)) {
      gyms = data.gyms as Record<string, unknown>[]
    } else if (Array.isArray(data)) {
      gyms = data as Record<string, unknown>[]
    } else {
      throw new Error('Invalid response format from API')
    }

    // Normalize all gyms to ensure reviewCount is set
    const normalizedGyms = normalizeGyms(gyms)

    // Limit the results if a limit is specified
    if (limit && limit > 0) {
      return normalizedGyms.slice(0, limit)
    }

    return normalizedGyms
  } catch (error) {
    console.error('Error fetching trending gyms:', error)
    throw error
  }
}

/**
 * Fetches a single gym by ID from the API
 */
export async function getGymById(id: string): Promise<Gym | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/gyms?id=${id}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch gym: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Handle different response formats
    let gym: Record<string, unknown> | null = null
    if (data.data) {
      gym = data.data as Record<string, unknown>
    } else if (data.gym) {
      gym = data.gym as Record<string, unknown>
    } else {
      gym = data as Record<string, unknown>
    }

    // Normalize the gym data
    return normalizeGym(gym)
  } catch (error) {
    console.error('Error fetching gym by id:', error)
    throw error
  }
}


