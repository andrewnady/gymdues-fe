'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Star } from 'lucide-react'
import { ReviewWithGym } from '@/types/gym'
import { Button } from './ui/button'
import Image from 'next/image'

interface ReviewsCarouselProps {
  reviews: ReviewWithGym[]
}

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  return (
    <div className='w-full'>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {reviews.map((review) => (
            <CarouselItem
              key={review.id}
              className='pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/3'
            >
              <Card className='h-full'>
                <CardContent className='p-6 flex flex-col h-full'>
                  <div className='flex items-start gap-3 mb-4'>
                    {review.gym?.logo && (
                      <div className='rounded-full bg-primary/10 flex-shrink-0 w-10 h-10'>
                        <Image
                          src={review.gym.logo}
                          alt={review.gym.name}
                          width={50}
                          height={50}
                          className='object-cover rounded-full w-full h-full'
                        />
                      </div>
                    )}
                    <div className='flex-1'>
                      <div className='flex items-center gap-1 mb-2'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <p className='text-sm font-semibold'>{review.reviewer}</p>
                      <p className='text-xs text-muted-foreground'>
                        {new Date(review.reviewed_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <p
                    className='text-muted-foreground mb-4 flex-1 line-clamp-4'
                    dangerouslySetInnerHTML={{ __html: review.text }}
                  />
                  <Button>
                    <Link href={`/gyms/${review.gymSlug}`}>{review.gymName} Details</Link>
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='hidden md:flex' />
        <CarouselNext className='hidden md:flex' />
      </Carousel>
    </div>
  )
}
