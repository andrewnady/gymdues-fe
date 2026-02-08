import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Gym } from "@/types/gym"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets review count from gym data, handling various field name variations
 * Falls back to calculating from reviews array length if not provided
 */
export function getReviewCount(gym: Gym | Record<string, unknown>): number {
  const reviewCount = (gym as Gym).reviewCount || (gym as Record<string, unknown>).reviewCount || (gym as Record<string, unknown>).review_count || (gym as Record<string, unknown>).reviews_count || (gym as Record<string, unknown>).reviewsCount;
  if (reviewCount !== undefined && reviewCount !== null) {
    return Number(reviewCount) || 0;
  }
  // Fallback to reviews array length
  return Array.isArray((gym as Gym).reviews) ? (gym as Gym).reviews.length : 0;
}

/**
 * Gets the best image path for a gym hero: featured_image first, then newest gallery image (first or last in array).
 * Handles API shapes: featured_image as { path } or [{ path }], featureImage string, gallery[{ path }].
 */
export function getGymHeroImagePath(gym: Gym | Record<string, unknown>): string | undefined {
  const g = gym as Record<string, unknown>
  const fi = g.featured_image
  if (fi != null) {
    if (Array.isArray(fi) && fi.length > 0) {
      const first = (fi[0] as Record<string, unknown>)?.path
      if (typeof first === 'string' && first) return first
    }
    if (typeof fi === 'object' && fi !== null) {
      const path = (fi as Record<string, unknown>).path
      if (typeof path === 'string' && path) return path
    }
  }
  if (typeof g.featureImage === 'string' && g.featureImage) return g.featureImage
  const gal = g.gallery as { path?: string }[] | undefined
  if (Array.isArray(gal) && gal.length > 0) {
    const first = gal[0]?.path
    if (first) return first
    const last = gal[gal.length - 1]?.path
    if (last) return last
  }
  return undefined
}

/**
 * Get placeholder image URL for gyms
 */
export function getPlaceholderImage(type: 'gym' | 'logo' = 'gym'): string {
  if (type === 'logo') {
    // Placeholder for logo (square, smaller)
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&q=80'
  }
  // Placeholder for gym feature image (landscape)
  return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&q=80'
}
