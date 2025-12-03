export interface Review {
  id: string
  reviewer: string
  rate: number
  text: string
  reviewed_at: string
  avatar?: string
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
  address: string
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
}
