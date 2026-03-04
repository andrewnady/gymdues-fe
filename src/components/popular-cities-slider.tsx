'use client'

import { BestGymCityCard } from '@/components/best-gym/city-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { PopularCityItem } from '@/lib/gyms-api'

interface PopularCitiesSliderProps {
  cities: PopularCityItem[]
}

export function PopularCitiesSlider({ cities }: PopularCitiesSliderProps) {
  if (!cities || cities.length === 0) return null

  return (
    <section className='py-20 bg-background'>
      <div className='container mx-auto px-4'>
        <div className='mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Explore Best Gyms in Popular U.S. Cities &amp; States
          </h2>
          <p className='text-muted-foreground text-lg'>
            Discover top-rated gyms across the U.S. by browsing our most popular city and state
            guides. Whether you&apos;re looking for the best gyms in major cities like New York,
            Los Angeles, or Miami—or you want to explore statewide options like California,
            Texas, or Florida—these curated pages help you compare gyms faster and find the
            right fit for your goals, budget, and training style.
          </p>
        </div>

        <Carousel
          opts={{ align: 'start', loop: true }}
          className='w-full'
        >
          <CarouselContent className='-ml-4 md:-ml-6'>
            {cities.map((city, index) => (
              <CarouselItem
                key={`${city.slug}-${index}`}
                className='pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3'
              >
                <BestGymCityCard
                  gym={{
                    title: city.title,
                    slug: city.slug,
                    type: 'city',
                    filter: city.slug,
                    featuredImage: city.featured_image,
                  }}
                />
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
