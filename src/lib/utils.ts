import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets review count from gym data, handling various field name variations
 * Falls back to calculating from reviews array length if not provided
 */
export function getReviewCount(gym: any): number {
  const reviewCount = gym.reviewCount || gym.review_count || gym.reviews_count || gym.reviewsCount;
  if (reviewCount !== undefined && reviewCount !== null) {
    return Number(reviewCount) || 0;
  }
  // Fallback to reviews array length
  return Array.isArray(gym.reviews) ? gym.reviews.length : 0;
}
