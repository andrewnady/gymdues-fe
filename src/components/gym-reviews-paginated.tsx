'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Review } from '@/types/gym'
import { ReadMoreText } from './read-more-text'

interface GymReviewsPaginatedProps {
  reviews: Review[]
  gymName: string
}

/**
 * Formats a date string to standard US DateTime format
 * Example: "December 3, 2025 at 7:04 PM" or "Dec 3, 2025, 7:04 PM"
 */
function formatUSDateTime(dateString: string): string {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString
    }

    // Format to US DateTime: "Month Day, Year at Hour:Minute AM/PM"
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York', // US Eastern Time
    }

    const formatted = date.toLocaleString('en-US', options)

    // Replace comma before time with "at" for better readability
    // "December 3, 2025, 7:04 PM" -> "December 3, 2025 at 7:04 PM"
    return formatted.replace(/, (\d{1,2}:\d{2} (?:AM|PM))$/, ' at $1')
  } catch {
    // If parsing fails, return original
    return dateString
  }
}

export function GymReviewsPaginated({
  reviews,
  gymName,
}: GymReviewsPaginatedProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 2

  // Calculate pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)
  const startIndex = (currentPage - 1) * reviewsPerPage
  const endIndex = startIndex + reviewsPerPage
  const currentReviews = reviews.slice(startIndex, endIndex)

  // Handle page changes
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // Scroll to reviews section when page changes
      const reviewsElement = document.getElementById('reviews-section')
      if (reviewsElement) {
        reviewsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className='space-y-4'>
        <p className='text-muted-foreground text-center py-8'>
          No reviews yet. Be the first to review {gymName}!
        </p>
      </div>
    )
  }

  return (
    <div id='reviews-section' className='space-y-4'>
      {/* Reviews List */}
      <div className='space-y-4'>
        {currentReviews.map((review) => (
          <div key={review.id} className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-semibold'>{review.reviewer}</p>
                <div className='flex items-center gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rate
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                        }`}
                    />
                  ))}
                </div>
              </div>
              <span className='text-sm text-muted-foreground'>
                {formatUSDateTime(review.reviewed_at)}
              </span>
            </div>
            <ReadMoreText className='text-muted-foreground'>{review.text}</ReadMoreText>
            <Separator />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between pt-4'>
          <div className='text-sm text-muted-foreground'>
            Showing {startIndex + 1}-{Math.min(endIndex, reviews.length)} of{' '}
            {reviews.length} reviews
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className='flex items-center gap-1'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)

                if (!showPage) {
                  // Show ellipsis
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className='px-2 text-muted-foreground'>
                        ...
                      </span>
                    )
                  }
                  return null
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => goToPage(page)}
                    className='min-w-[2.5rem]'
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

