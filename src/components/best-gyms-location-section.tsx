'use client'

import { Gym } from '@/types/gym'
import { GymCard } from '@/components/gym-card'
import { ReadMoreText } from '@/components/read-more-text'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface BestGymsLocationSectionProps {
  title: string
  description?: string
  gyms: Gym[]
}

export function BestGymsLocationSection({
  title,
  description,
  gyms,
}: BestGymsLocationSectionProps) {
  if (!gyms || gyms.length === 0) {
    return null
  }

  return (
    <section className='py-20 bg-background'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row md:justify-between mb-12 gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='text-3xl md:text-4xl font-bold'>{title}</h2>
            </div>
            {description && (
              <ReadMoreText className='text-muted-foreground text-lg'>
                {description}
              </ReadMoreText>
            )}
          </div>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-4 md:-ml-6'>
            {gyms.map((gym) => (
              <CarouselItem
                key={gym.id}
                className='pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3'
              >
                <GymCard gym={gym} hideDescription={true} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='hidden md:flex -left-4' />
          <CarouselNext className='hidden md:flex -right-4' />
        </Carousel>
      </div>
    </section>
  )
}

