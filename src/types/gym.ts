export interface Review {
  id: string
  reviewer: string
  rate: number
  text: string
  reviewed_at: string
  avatar?: string
  gym?: {
    id: string
    name: string
    slug: string
    logo: string
  }
}

export interface Plan {
  id: string
  tier_name: string
  price: number
  frequency: string // e.g., "Monthly", "3 Months", "Yearly"
  description: string
  is_popular?: boolean
}

export interface OperatingHours {
  day: string
  from: string
  to: string
  closed?: boolean
}

export interface GymFAQ {
  id: string
  question: string
  answer: string
  category?: string
}

export interface GymAddress {
  id: number | string
  latitude: number
  longitude: number
  full_address?: string | null
  city?: string | null
  state?: string | null
  street?: string | null
  postal_code?: string | null
  is_primary?: boolean
}

/** Primary address object returned with each gym from the list API (has lat/lng for map) */
export interface GymPrimaryAddress {
  id?: number | string
  latitude?: number
  longitude?: number
  full_address?: string | null
  street?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
}

export interface AddressesPaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
  next_page_url?: string | null
  prev_page_url?: string | null
}

export interface AddressesPaginatedResponse {
  data: GymAddress[]
  meta: AddressesPaginationMeta
}

/** Single address with location-specific reviews, hours, and pricing (from GET /addresses/{id}) */
export interface AddressDetail {
  id: number | string
  hours: OperatingHours[]
  reviews: Review[]
  pricing: Plan[]
}

export interface Gym {
  id: string
  slug: string
  name: string
  description: string
  logo?: {
    path: string
    alt: string
  }
  gallery?: {
    path: string
    alt: string
  }[]
  featureImage: string
  /** Can be string (legacy) or primary address object from list API (with lat/lng) */
  address: string | GymPrimaryAddress
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website?: string
  rating: number
  reviewCount: number
  reviews: Review[]
  pricing: Plan[]
  faqs: GymFAQ[]
  hours: OperatingHours[]
  amenities?: string[]
  tags?: string[]
  created_at?: string
  updated_at?: string
  addresses_count?: number
}

export interface ReviewWithGym {
  id: string
  reviewer: string
  rate: number
  rating: number // Alias for rate for compatibility
  text: string
  reviewed_at: string
  formattedDate?: string // Optional formatted date to prevent hydration mismatches
  avatar?: string
  gymName: string
  gymSlug: string
  gym: {
    id: string
    name: string
    slug: string
    logo: string
  }
}

export interface StateWithCount {
  state: string
  stateName: string
  count: number
}
