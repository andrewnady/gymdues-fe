import {
  Gym,
  GymAddress,
  AddressDetail,
  StateWithCount,
  AddressesPaginatedResponse,
  AddressesPaginationMeta,
  AddressesByLocationResponse,
  GymWithAddressesGroup,
  LocationWithCount,
} from '@/types/gym'
import { getApiBaseUrl, transformApiUrl, transformApiResponse } from './api-config'

const API_BASE_URL = getApiBaseUrl()

export interface ApiError {
  message: string
  status?: number
}

export interface GymsPaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
  next_page_url?: string | null
  prev_page_url?: string | null
}

export interface PaginatedGymsResponse {
  gyms: Gym[]
  meta: GymsPaginationMeta
}

/**
 * Normalizes gym data from API to ensure all required fields are present
 * Handles different field name variations and calculates missing values
 */
function normalizeGym(gym: Record<string, unknown>): Gym {
  // Handle reviewCount - check for various field name variations
  let reviewCount = (gym.reviewCount ||
    gym.review_count ||
    gym.reviews_count ||
    gym.reviewsCount) as number | undefined

  // If reviewCount is not provided, calculate it from reviews array
  if (reviewCount === undefined || reviewCount === null) {
    reviewCount = Array.isArray(gym.reviews) ? gym.reviews.length : 0
  }

  const addressesCount =
    gym.addresses_count !== undefined && gym.addresses_count !== null
      ? Number(gym.addresses_count)
      : undefined

  // Transform URL fields to replace Docker internal hostnames
  const normalizedGym: Record<string, unknown> = { ...gym }

  // Transform logo URL if present
  if (normalizedGym.logo && typeof normalizedGym.logo === 'string') {
    normalizedGym.logo = transformApiUrl(normalizedGym.logo)
  } else if (
    normalizedGym.logo &&
    typeof normalizedGym.logo === 'object' &&
    normalizedGym.logo !== null
  ) {
    const logoObj = normalizedGym.logo as Record<string, unknown>
    if (logoObj.path) logoObj.path = transformApiUrl(String(logoObj.path))
    if (logoObj.url) logoObj.url = transformApiUrl(String(logoObj.url))
  }

  // Transform any other image/URL fields
  const urlFields = ['image', 'photo', 'cover', 'thumbnail', 'avatar']
  urlFields.forEach((field) => {
    if (normalizedGym[field] && typeof normalizedGym[field] === 'string') {
      normalizedGym[field] = transformApiUrl(normalizedGym[field] as string)
    }
  })

  return {
    ...normalizedGym,
    reviewCount: Number(reviewCount) || 0,
    addresses_count: addressesCount,
    // Preserve date fields if they exist
    created_at: normalizedGym.created_at ? String(normalizedGym.created_at) : undefined,
    updated_at: normalizedGym.updated_at ? String(normalizedGym.updated_at) : undefined,
  } as Gym
}

/**
 * Normalizes an array of gyms
 */
function normalizeGyms(gyms: Record<string, unknown>[]): Gym[] {
  return gyms.map(normalizeGym)
}

/**
 * Fetches all gyms from the API (non-paginated helper)
 * Primarily used internally where we just need the list.
 */
export async function getAllGyms(
  search?: string,
  state?: string,
  city?: string,
  trending?: boolean,
  popular?: boolean,
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
    if (popular !== undefined) {
      url.searchParams.append('popular', popular.toString())
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch gyms: ${response.status} ${response.statusText}`)
    }

    let data = await response.json()

    // Transform URLs in the response (replace nginx with localhost:8080)
    data = transformApiResponse(data)

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
 * Minimal gym shape for sitemap (when options.fields === 'sitemap').
 * API returns only id, slug, updated_at to reduce payload.
 */
export type GymSitemapEntry = Pick<Gym, 'slug' | 'updated_at'>

/**
 * Fetches paginated gyms from the API (Laravel-style paginator)
 * and returns both the gyms and pagination metadata.
 * Use fields: 'sitemap' to request only id, slug, updated_at (for sitemap generation).
 */
export async function getPaginatedGyms(options: {
  search?: string
  state?: string
  city?: string
  trending?: boolean
  page?: number
  perPage?: number
  /** Request minimal fields (id, slug, updated_at) for sitemap generation */
  fields?: 'sitemap' | string
}): Promise<PaginatedGymsResponse> {
  const { search, state, city, trending, page, perPage, fields } = options

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
    if (page && page > 0) {
      url.searchParams.append('page', page.toString())
    }
    if (perPage && perPage > 0) {
      // Laravel-style per-page parameter
      url.searchParams.append('per_page', perPage.toString())
    }
    if (fields === 'sitemap') {
      url.searchParams.append('fields', 'sitemap')
    } else if (fields) {
      url.searchParams.append('fields', fields)
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch gyms: ${response.status} ${response.statusText}`)
    }

    let data = await response.json()

    // Transform URLs in the response
    data = transformApiResponse(data)

    // Laravel-style pagination: { current_page, data: [...], last_page, per_page, total, ... }
    type LaravelPaginatedResponse = {
      data: Record<string, unknown>[]
      current_page: number
      from: number | null
      last_page: number
      per_page: number
      to: number | null
      total: number
      next_page_url?: string | null
      prev_page_url?: string | null
    }

    if (
      typeof data === 'object' &&
      data !== null &&
      'current_page' in (data as Record<string, unknown>) &&
      Array.isArray((data as LaravelPaginatedResponse).data)
    ) {
      const paginated = data as LaravelPaginatedResponse

      const gyms = normalizeGyms(paginated.data)

      const meta: GymsPaginationMeta = {
        current_page: paginated.current_page,
        from: paginated.from,
        last_page: paginated.last_page,
        per_page: paginated.per_page,
        to: paginated.to,
        total: paginated.total,
        next_page_url: paginated.next_page_url,
        prev_page_url: paginated.prev_page_url,
      }

      return { gyms, meta }
    }

    // Fallback to non-paginated handling
    let gymsArray: Record<string, unknown>[] = []

    if (
      typeof data === 'object' &&
      data !== null &&
      'gyms' in (data as Record<string, unknown>) &&
      Array.isArray((data as { gyms: Record<string, unknown>[] }).gyms)
    ) {
      gymsArray = (data as { gyms: Record<string, unknown>[] }).gyms
    } else if (Array.isArray(data)) {
      gymsArray = data as Record<string, unknown>[]
    } else if (
      typeof data === 'object' &&
      data !== null &&
      'data' in (data as Record<string, unknown>) &&
      Array.isArray((data as { data: Record<string, unknown>[] }).data)
    ) {
      gymsArray = (data as { data: Record<string, unknown>[] }).data
    } else {
      throw new Error('Invalid response format from API')
    }

    const gyms = normalizeGyms(gymsArray)

    const total = gyms.length
    const effectivePerPage = perPage && perPage > 0 ? perPage : total || 1
    const currentPage = page && page > 0 ? page : 1
    const lastPage = Math.max(1, Math.ceil(total / effectivePerPage))
    const from = total === 0 ? null : (currentPage - 1) * effectivePerPage + 1
    const to = total === 0 ? null : Math.min(currentPage * effectivePerPage, total)

    const meta: GymsPaginationMeta = {
      current_page: currentPage,
      from,
      last_page: lastPage,
      per_page: effectivePerPage,
      to,
      total,
      next_page_url: null,
      prev_page_url: null,
    }

    return { gyms, meta }
  } catch (error) {
    console.error('Error fetching paginated gyms:', error)
    throw error
  }
}

export async function filterTopGyms(options: {
  state?: string
  city?: string
  page?: number
  perPage?: number
}): Promise<PaginatedGymsResponse> {
  const { state, city, page, perPage } = options

  try {
    const url = new URL(`${API_BASE_URL}/api/v1/gyms/filtered-top-gyms`)

    if (state && state.trim()) {
      url.searchParams.append('state', state.trim())
    }
    if (city && city.trim()) {
      url.searchParams.append('city', city.trim())
    }
    if (page && page > 0) {
      url.searchParams.append('page', page.toString())
    }
    if (perPage && perPage > 0) {
      url.searchParams.append('per_page', perPage.toString())
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch gyms: ${response.status} ${response.statusText}`)
    }

    let data = await response.json()

    // Transform URLs in the response
    data = transformApiResponse(data)

    // Laravel-style pagination
    if (
      typeof data === 'object' &&
      data !== null &&
      'current_page' in data &&
      Array.isArray(data.data)
    ) {
      const gyms = normalizeGyms(data.data)
      const meta: GymsPaginationMeta = {
        current_page: data.current_page,
        from: data.from,
        last_page: data.last_page,
        per_page: data.per_page,
        to: data.to,
        total: data.total,
        next_page_url: data.next_page_url ?? null,
        prev_page_url: data.prev_page_url ?? null,
      }
      return { gyms, meta }
    }

    // Fallback: plain array
    const gymsArray = Array.isArray(data) ? data : []
    const gyms = normalizeGyms(gymsArray)
    return {
      gyms,
      meta: {
        current_page: 1,
        from: gyms.length > 0 ? 1 : null,
        last_page: 1,
        per_page: gyms.length || 1,
        to: gyms.length > 0 ? gyms.length : null,
        total: gyms.length,
        next_page_url: null,
        prev_page_url: null,
      },
    }
  } catch (error) {
    console.error('Error fetching filtered top gyms:', error)
    throw error
  }
}

/**
 * Fetches a single gym by slug from the API
 * Optionally pass addressId to get reviews, hours, and pricing for that location.
 * Falls back to fetching all gyms and filtering by slug if the slug endpoint doesn't exist.
 */
export async function getGymBySlug(slug: string, addressId?: string | null): Promise<Gym | null> {
  if (!slug || typeof slug !== 'string') {
    console.error('Invalid slug provided:', slug)
    return null
  }

  try {
    // Try the slug endpoint first
    try {
      const url = new URL(`${API_BASE_URL}/api/v1/gyms/${encodeURIComponent(slug)}`)
      if (addressId != null && String(addressId).trim()) {
        url.searchParams.set('address_id', String(addressId).trim())
      }
      const response = await fetch(url.toString(), {
        next: { revalidate: 60 },
      })

      if (response.ok) {
        let data = await response.json()

        // Transform URLs in the response
        data = transformApiResponse(data)

        // Handle different response formats
        let gym: Record<string, unknown> | null = null
        if (data.data) {
          gym = data.data as Record<string, unknown>
        } else if (data.gym) {
          gym = data.gym as Record<string, unknown>
        } else {
          gym = data as Record<string, unknown>
        }

        if (!gym) {
          return null
        }

        // Normalize the gym data with error handling
        try {
          return normalizeGym(gym)
        } catch (normalizeError) {
          console.error('Error normalizing gym data:', normalizeError)
          // Return null if normalization fails since we can't guarantee data structure
          return null
        }
      }

      // If 404, return null
      if (response.status === 404) {
        return null
      }

      // If other error status, log and continue to fallback
      if (!response.ok) {
        console.warn(
          `API returned ${response.status} for slug ${slug}, falling back to filtering all gyms`,
        )
      }
    } catch (fetchError) {
      // If slug endpoint doesn't exist or fails, fall back to fetching all and filtering
      console.warn('Slug endpoint not available, falling back to filtering all gyms:', fetchError)
    }

    // Fallback: fetch all gyms and filter by slug
    try {
      const allGyms = await getAllGyms()
      const gym = allGyms.find((g) => g.slug === slug)
      return gym || null
    } catch (fallbackError) {
      console.error('Error in fallback gym fetch:', fallbackError)
      throw fallbackError
    }
  } catch (error) {
    console.error('Error fetching gym by slug:', error)
    // Re-throw to let the page component handle it
    throw error
  }
}

/**
 * Fetches paginated addresses for a gym (default 5 per page).
 * Used for the locations map/list when a gym has multiple addresses.
 */
export async function getAddressesByGymId(
  gymId: string,
  options?: { page?: number; per_page?: number },
): Promise<AddressesPaginatedResponse> {
  const page = options?.page ?? 1
  const perPage = options?.per_page ?? 5
  const url = new URL(`${API_BASE_URL}/api/v1/gyms/${encodeURIComponent(gymId)}/addresses`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('per_page', String(perPage))

  const response = await fetch(url.toString(), {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch addresses: ${response.status} ${response.statusText}`)
  }

  let resData = await response.json()

  // Transform URLs in the response
  resData = transformApiResponse(resData)

  const res = resData as {
    data: GymAddress[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
    next_page_url?: string | null
    prev_page_url?: string | null
  }

  const meta: AddressesPaginationMeta = {
    current_page: res.current_page,
    last_page: res.last_page,
    per_page: res.per_page,
    total: res.total,
    from: res.from ?? null,
    to: res.to ?? null,
    next_page_url: res.next_page_url ?? null,
    prev_page_url: res.prev_page_url ?? null,
  }

  return {
    data: Array.isArray(res.data) ? (res.data as GymAddress[]) : [],
    meta,
  }
}

/**
 * Fetches addresses filtered by city and/or postal_code (or search), grouped by gym.
 * Used when filtering gyms by location so the map/list show only locations in that area.
 */
export async function getAddressesByLocation(options?: {
  city?: string
  postal_code?: string
  search?: string
}): Promise<AddressesByLocationResponse> {
  const url = new URL(`${API_BASE_URL}/api/v1/gyms/addresses-by-location`)
  if (options?.city?.trim()) {
    url.searchParams.set('city', options.city.trim())
  }
  if (options?.postal_code?.trim()) {
    url.searchParams.set('postal_code', options.postal_code.trim())
  }
  if (options?.search?.trim()) {
    url.searchParams.set('search', options.search.trim())
  }
  const response = await fetch(url.toString(), { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(
      `Failed to fetch addresses by location: ${response.status} ${response.statusText}`,
    )
  }
  const data = (await response.json()) as { data: GymWithAddressesGroup[] }
  return {
    data: Array.isArray(data.data) ? data.data : [],
  }
}

/**
 * Fetches locations (city+state and postal_code) with counts for autocomplete.
 * Sorted by count desc. Optional q filters by label.
 */
export async function getLocations(q?: string): Promise<LocationWithCount[]> {
  const url = new URL(`${API_BASE_URL}/api/v1/gyms/locations`)
  if (q && q.trim()) {
    url.searchParams.set('q', q.trim())
  }
  const response = await fetch(url.toString(), { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.status} ${response.statusText}`)
  }
  const data = (await response.json()) as LocationWithCount[]
  return Array.isArray(data) ? data : []
}

/**
 * Fetches a single address by ID with location-specific reviews, hours, and pricing.
 * Used when a location is selected in the gym locations map to update the page sections.
 */
export async function getAddress(addressId: string): Promise<AddressDetail | null> {
  if (!addressId || !String(addressId).trim()) return null
  const url = `${API_BASE_URL}/api/v1/addresses/${encodeURIComponent(String(addressId).trim())}`
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Failed to fetch address: ${response.status} ${response.statusText}`)
  }
  let data = await response.json()

  // Transform URLs in the response
  data = transformApiResponse(data) as Record<string, unknown>
  return {
    id: data.id as number | string,
    hours: (Array.isArray(data.hours) ? data.hours : []) as AddressDetail['hours'],
    reviews: (Array.isArray(data.reviews) ? data.reviews : []) as AddressDetail['reviews'],
    pricing: (Array.isArray(data.pricing) ? data.pricing : []) as AddressDetail['pricing'],
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

    let data = await response.json()

    // Transform URLs in the response
    data = transformApiResponse(data)

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
 * Fetches Gyms with rating > 4.5 from the API
 */
export async function getRatedGyms(limit?: number): Promise<Gym[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/gyms/highly-rated`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch rated gyms: ${response.status} ${response.statusText}`)
    }

    let data = await response.json()

    // Transform URLs in the response
    data = transformApiResponse(data)

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
    console.error('Error fetching rated gyms:', error)
    throw error
  }
}

/**
 * Fetches latest gyms from the API (first page, no trending filter).
 * Used as fallback when trending gyms return empty.
 */
export async function getLatestGyms(limit: number): Promise<Gym[]> {
  try {
    const { gyms } = await getPaginatedGyms({ perPage: limit, page: 1 })
    return gyms
  } catch (error) {
    console.error('Error fetching latest gyms:', error)
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

    let data = await response.json()

    // Transform URLs in the response
    data = transformApiResponse(data)

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

/**
 * Gets states with gym counts from the database (GET /api/v1/gyms/states).
 * Use for state filter autocomplete.
 */
export async function getStates(): Promise<StateWithCount[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/gyms/states`, {
      next: { revalidate: 300 },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch states: ${response.status} ${response.statusText}`)
    }
    let data = await response.json()

    // Transform URLs in the response
    data = transformApiResponse(data)

    const states = data as { state: string; stateName: string; count: number }[]
    return Array.isArray(states) ? states : []
  } catch (error) {
    console.error('Error fetching states:', error)
    return []
  }
}

/**
 * Gets states with gym counts from the database (GET /api/v1/gyms/cities-and-states).
 * Use for state filter autocomplete.
 */
export async function getCityStates(): Promise<{
  states: StateWithCount[]
  cities: StateWithCount[]
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/gyms/cities-and-states`, {
      next: { revalidate: 300 },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch states: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()

    return {
      states: Array.isArray(data.states) ? data.states : [],
      cities: Array.isArray(data.cities) ? data.cities : [],
    }
  } catch (error) {
    console.error('Error fetching states:', error)
    return { states: [], cities: [] }
  }
}

/**
 * Gets states with gym counts (legacy: fetches all gyms and derives states).
 * Prefer getStates() which uses the database endpoint.
 */
export async function getStatesWithCounts(): Promise<StateWithCount[]> {
  try {
    const states = await getStates()
    if (states.length > 0) return states
    const gyms = await getAllGyms()
    const stateMap = new Map<string, number>()
    gyms.forEach((gym) => {
      if (gym.state) {
        const count = stateMap.get(gym.state) || 0
        stateMap.set(gym.state, count + 1)
      }
    })
    const stateNames: Record<string, string> = {
      AL: 'Alabama',
      AK: 'Alaska',
      AZ: 'Arizona',
      AR: 'Arkansas',
      CA: 'California',
      CO: 'Colorado',
      CT: 'Connecticut',
      DE: 'Delaware',
      FL: 'Florida',
      GA: 'Georgia',
      HI: 'Hawaii',
      ID: 'Idaho',
      IL: 'Illinois',
      IN: 'Indiana',
      IA: 'Iowa',
      KS: 'Kansas',
      KY: 'Kentucky',
      LA: 'Louisiana',
      ME: 'Maine',
      MD: 'Maryland',
      MA: 'Massachusetts',
      MI: 'Michigan',
      MN: 'Minnesota',
      MS: 'Mississippi',
      MO: 'Missouri',
      MT: 'Montana',
      NE: 'Nebraska',
      NV: 'Nevada',
      NH: 'New Hampshire',
      NJ: 'New Jersey',
      NM: 'New Mexico',
      NY: 'New York',
      NC: 'North Carolina',
      ND: 'North Dakota',
      OH: 'Ohio',
      OK: 'Oklahoma',
      OR: 'Oregon',
      PA: 'Pennsylvania',
      RI: 'Rhode Island',
      SC: 'South Carolina',
      SD: 'South Dakota',
      TN: 'Tennessee',
      TX: 'Texas',
      UT: 'Utah',
      VT: 'Vermont',
      VA: 'Virginia',
      WA: 'Washington',
      WV: 'West Virginia',
      WI: 'Wisconsin',
      WY: 'Wyoming',
      DC: 'District of Columbia',
    }
    return Array.from(stateMap.entries())
      .map(([state, count]) => ({
        state,
        stateName: stateNames[state] || state,
        count,
      }))
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error fetching states with counts:', error)
    return []
  }
}
