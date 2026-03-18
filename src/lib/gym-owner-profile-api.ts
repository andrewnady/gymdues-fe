import { getApiBaseUrl } from './api-config'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Location {
  id: number
  is_primary: boolean
  street: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string | null
}

export interface LocationsResponse {
  success: boolean
  gym_id?: number
  gym_name?: string
  locations?: Location[]
  message?: string
}

export interface DescriptionResponse {
  success: boolean
  gym_id?: number
  name?: string
  description?: string
  message?: string
}

export interface Photo {
  id: number
  file_name: string
  url: string
  thumb_url: string
  created_at: string
}

export interface PhotosResponse {
  success: boolean
  gym_id?: number
  photos?: Photo[]
  message?: string
}

export interface UploadPhotosResponse {
  success: boolean
  message?: string
  uploaded?: Photo[]
}

export interface PricingPlan {
  id: number
  tier_name: string
  price: number
  frequency: string | null
  description: string | null
}

export interface PricingResponse {
  success: boolean
  address_id?: number
  pricing?: PricingPlan[]
  message?: string
}

export interface PricingMutationResponse {
  success: boolean
  message?: string
  plan?: PricingPlan
}

export interface HourEntry {
  id?: number
  day: string
  from: string | null
  to: string | null
  is_closed: boolean
  is_24?: boolean
}

export interface HoursResponse {
  success: boolean
  address_id?: number
  hours?: HourEntry[]
  message?: string
}

export interface Review {
  id: number
  reviewer: string
  rating: number
  text: string
  status: string
  source: string
  reviewed_at: string | null
  created_at: string
  owner_response: string | null
  owner_responded_at: string | null
}

export interface ReviewsResponse {
  success: boolean
  data?: Review[]
  meta?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
  message?: string
}

export interface RespondToReviewResponse {
  success: boolean
  message?: string
  owner_response?: string
  owner_responded_at?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

// ─── Locations ────────────────────────────────────────────────────────────────

export async function apiGetLocations(token: string): Promise<LocationsResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/locations`, {
    headers: authHeaders(token),
  })
  if (!res.ok) return { success: false, message: 'Failed to load locations.' }
  return res.json()
}

// ─── Description ─────────────────────────────────────────────────────────────

export async function apiGetDescription(token: string): Promise<DescriptionResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/profile/description`, {
    headers: authHeaders(token),
  })
  if (!res.ok) return { success: false, message: 'Failed to load description.' }
  return res.json()
}

export async function apiUpdateDescription(
  token: string,
  description: string,
): Promise<DescriptionResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/profile/description`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ description }),
  })
  return res.json()
}

// ─── Photos ───────────────────────────────────────────────────────────────────

export async function apiGetPhotos(token: string): Promise<PhotosResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/profile/photos`, {
    headers: authHeaders(token),
  })
  if (!res.ok) return { success: false, message: 'Failed to load photos.' }
  return res.json()
}

export async function apiUploadPhotos(
  token: string,
  files: File[],
): Promise<UploadPhotosResponse> {
  const formData = new FormData()
  files.forEach((file) => formData.append('photos[]', file))

  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/profile/photos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return res.json()
}

export async function apiDeletePhoto(
  token: string,
  id: number,
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/profile/photos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return res.json()
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export async function apiGetPricing(
  token: string,
  addressId: number,
): Promise<PricingResponse> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/v1/gym-owner/locations/${addressId}/pricing`,
    { headers: authHeaders(token) },
  )
  if (!res.ok) return { success: false, message: 'Failed to load pricing.' }
  return res.json()
}

export async function apiAddPricing(
  token: string,
  addressId: number,
  plan: Omit<PricingPlan, 'id'>,
): Promise<PricingMutationResponse> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/v1/gym-owner/locations/${addressId}/pricing`,
    {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ address_id: addressId, ...plan }),
    },
  )
  return res.json()
}

export async function apiUpdatePricing(
  token: string,
  addressId: number,
  planId: number,
  plan: Partial<Omit<PricingPlan, 'id'>>,
): Promise<PricingMutationResponse> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/v1/gym-owner/locations/${addressId}/pricing/${planId}`,
    {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ address_id: addressId, ...plan }),
    },
  )
  return res.json()
}

export async function apiDeletePricing(
  token: string,
  addressId: number,
  planId: number,
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/v1/gym-owner/locations/${addressId}/pricing/${planId}`,
    {
      method: 'DELETE',
      headers: authHeaders(token),
    },
  )
  return res.json()
}

// ─── Hours ────────────────────────────────────────────────────────────────────

export async function apiGetHours(token: string, addressId: number): Promise<HoursResponse> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/v1/gym-owner/locations/${addressId}/hours`,
    { headers: authHeaders(token) },
  )
  if (!res.ok) return { success: false, message: 'Failed to load hours.' }
  return res.json()
}

export async function apiUpdateHours(
  token: string,
  addressId: number,
  hours: HourEntry[],
): Promise<HoursResponse> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/v1/gym-owner/locations/${addressId}/hours`,
    {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ address_id: addressId, hours }),
    },
  )
  return res.json()
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function apiGetReviews(
  token: string,
  addressId: number,
  params?: { status?: 'all' | 'pending' | 'approved'; page?: number; per_page?: number },
): Promise<ReviewsResponse> {
  const url = new URL(
    `${getApiBaseUrl()}/api/v1/gym-owner/locations/${addressId}/reviews`,
  )
  if (params?.status) url.searchParams.set('status', params.status)
  if (params?.page) url.searchParams.set('page', String(params.page))
  if (params?.per_page) url.searchParams.set('per_page', String(params.per_page))

  const res = await fetch(url.toString(), { headers: authHeaders(token) })
  if (!res.ok) return { success: false, message: 'Failed to load reviews.' }
  return res.json()
}

export async function apiRespondToReview(
  token: string,
  reviewId: number,
  response: string,
  addressId: number,
): Promise<RespondToReviewResponse> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/v1/gym-owner/reviews/${reviewId}/respond`,
    {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ address_id: addressId, response }),
    },
  )
  return res.json()
}
