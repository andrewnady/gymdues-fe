import { ReviewWithGym } from '@/types/gym'
import { ReviewsCarousel } from '@/components/reviews-carousel'
import { ReadMoreText } from '@/components/read-more-text'

interface ReviewsSectionProps {
  reviews: ReviewWithGym[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

  // Helper function to format date safely
  const formatReviewDate = (dateStr?: string): string => {
    if (!dateStr) return new Date().toISOString().split('T')[0]
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0]
      }
      return date.toISOString().split('T')[0]
    } catch {
      return new Date().toISOString().split('T')[0]
    }
  }

  // Review Schemas (Schema.org) - Same format as gyms slug page
  const reviewSchemas = reviews
    .filter((review) => review.gymSlug)
    .map((review) => {
      // Format date for review - just the date part, not full ISO
      const reviewDate = formatReviewDate(review.reviewed_at)

      // Strip HTML tags from review text
      const reviewBody = review.text?.replace(/<[^>]*>/g, '').trim() || ''

      const gymUrl = `${siteUrl}/gyms/${review.gymSlug}`

      return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
          '@type': 'ExerciseGym',
          name: review.gymName || review.gym?.name,
          url: gymUrl,
        },
        author: {
          '@type': 'Person',
          name: review.reviewer || 'Anonymous',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: String(review.rating || review.rate || 0),
        },
        datePublished: reviewDate,
        reviewBody: reviewBody,
      }
    })

  return (
    <section className='py-20 bg-muted/30'>
      {/* Review Schemas (JSON-LD) - only output when present to avoid empty values for SEO */}
      {reviewSchemas.length > 0 &&
        reviewSchemas.map((review, index) => (
          <script
            key={`review-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(review),
            }}
          />
        ))}
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center gap-2 mb-4'>
            <h2 className='text-3xl md:text-4xl font-bold'>What Gymdues Members Say</h2>
          </div>
          <ReadMoreText className='text-muted-foreground text-lg max-w-4xl mx-auto'>
            Real reviews make gym decisions easier—especially when you&apos;re comparing value,
            fees, and overall experience. In What Our Members Say, you&apos;ll see honest feedback
            from members who&apos;ve tried popular gyms and studios people search for most, like{' '}
            <strong>la fitness membership cost</strong>, <strong>anytime fitness membership cost</strong>
            , <strong>24 hour fitness membership cost</strong>, <strong>nysc membership cost</strong>,
            and premium options like <strong>lifetime gym membership cost</strong> and{' '}
            <strong>bay club membership cost</strong>. Reviews help you understand what you really
            get for the price—cleanliness, crowd levels, class quality, cancellations, and whether
            the membership feels worth it—before you commit to a plan.
          </ReadMoreText>
        </div>

        {reviews.length > 0 && (
          <div className='max-w-7xl mx-auto'>
            <ReviewsCarousel reviews={reviews} />
          </div>
        )}
      </div>
    </section>
  )
}

