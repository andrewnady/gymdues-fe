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
