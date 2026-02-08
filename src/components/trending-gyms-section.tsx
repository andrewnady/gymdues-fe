'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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

interface TrendingGymsSectionProps {
  gyms: Gym[]
}

export function TrendingGymsSection({ gyms }: TrendingGymsSectionProps) {
  return (
    <section className='py-20 bg-background'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row md:justify-between mb-12 gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='text-3xl md:text-4xl font-bold'>Trending Gyms</h2>
            </div>
            <ReadMoreText className='text-muted-foreground text-lg'>
              Discover the most popular fitness centers people are searching for right now in
              Trending Gyms—and see what they typically cost before you waste time touring. Compare
              pricing interest across big-name brands like <strong>24 hour fitness prices</strong>,{' '}
              <strong>corepower yoga prices</strong>, and <strong>curves prices</strong>, plus
              plan-related searches like <strong>la fitness prices</strong>,{' '}
              <strong>anytime fitness prices</strong>, and <strong>pure barre prices</strong>. From
              high-intensity training and boxing to boutique fitness, we highlight the gyms gaining
              traction and connect you to the pricing details behind searches like{' '}
              <strong>orangetheory membership cost</strong>, <strong>ufc gym prices</strong>, and{' '}
              <strong>title boxing club prices</strong>—so you can follow what&apos;s trending and
              still make a smart value decision.
            </ReadMoreText>
          </div>
          <Link
            href='/gyms'
            className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-4 md:mt-0 text-nowrap'
          >
            View All Gyms
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-4 md:-ml-6'>
            {gyms.filter((gym) => gym.description?.length > 0).map((gym) => (
              <CarouselItem
                key={gym.id}
                className='pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3'
              >
                <GymCard gym={gym} />
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

