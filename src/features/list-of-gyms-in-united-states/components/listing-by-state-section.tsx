'use client'

import Link from 'next/link'
import { MapPin, ArrowRight, Globe2 } from 'lucide-react'
import type { StateWithCount } from '@/types/gym'
import { stateGymsdataPath } from '@/lib/gymsdata-utils'
import { ReadMoreText } from '@/components/read-more-text'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface ListingByStateSectionProps {
  states: StateWithCount[]
}

// City/state hero images for featured cards
const stateImages: Record<string, string> = {
  NY: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&q=80',
  CA: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&q=80',
  TX: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&h=600&fit=crop&q=80',
  FL: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop&q=80',
  IL: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80',
  PA: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&q=80',
  OH: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80',
  GA: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop&q=80',
}
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&q=80'

function StateCard({ state }: { state: StateWithCount }) {
  const image = stateImages[state.state] || DEFAULT_IMAGE
  return (
    <Link
      href={stateGymsdataPath(state)}
      className='group relative overflow-hidden rounded-xl h-56 md:h-64 cursor-pointer block'
    >
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110'
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent' />
      <div className='absolute bottom-0 left-0 right-0 p-5'>
        <div className='flex items-center gap-2 mb-1'>
          <MapPin className='h-4 w-4 text-primary shrink-0' />
          <h3 className='text-xl font-bold text-white'>{state.stateName}</h3>
        </div>
        <p className='text-white/90 text-sm'>
          {state.count.toLocaleString('en-US')} {state.count === 1 ? 'gym' : 'gyms'} available
        </p>
      </div>
    </Link>
  )
}

export function ListingByStateSection({ states }: ListingByStateSectionProps) {
  if (states.length === 0) return null

  return (
    <section className='py-16 md:py-20 bg-muted/30' aria-labelledby='browse-by-state-heading'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10 p-5 md:p-6 rounded-2xl border border-border/60 bg-card/50'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                <Globe2 className='h-5 w-5 text-primary' />
              </div>
              <h2 id='browse-by-state-heading' className='text-2xl md:text-3xl font-bold tracking-tight'>
                Browse Gyms By State
              </h2>
            </div>
            <ReadMoreText className='text-muted-foreground text-base max-w-3xl'>
              Start your search locally and find the best gym options near you. Explore verified
              listings by state and compare amenities, location, and pricing—whether you&apos;re
              researching <strong>LA Fitness membership cost</strong>,{' '}
              <strong>Anytime Fitness membership cost</strong>,{' '}
              <strong>24 Hour Fitness membership cost</strong>, or{' '}
              <strong>NYSC membership cost</strong>, narrow down choices fast and find gyms that
              match your budget and goals.
            </ReadMoreText>
          </div>
          <Link
            href='/gymsdata'
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md transition-all shrink-0'
          >
            Explore all gyms
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='relative group/carousel'>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              dragFree: false,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-4 md:-ml-5'>
              {states.map((state) => (
                <CarouselItem
                  key={state.state}
                  className='pl-4 md:pl-5 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4'
                >
                  <StateCard state={state} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='-left-2 md:-left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full border-2 bg-background shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-40' />
            <CarouselNext className='-right-2 md:-right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full border-2 bg-background shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-40' />
          </Carousel>
        </div>

        <p className='mt-6 text-center text-sm flex flex-wrap justify-center gap-4'>
          <Link href='#states-table' className='underline underline-offset-2 hover:text-primary font-medium'>
            View full table with gym counts by state
          </Link>
          <Link href='#states-table' className='text-muted-foreground hover:text-primary hover:underline'>
            Show all data →
          </Link>
        </p>
      </div>
    </section>
  )
}
