'use client'

import { BestGymCityCard } from '@/components/best-gym/city-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { gymCities } from '@/types/gym'
import { useState, useCallback } from 'react'

const popularCities: gymCities[] = [
  { title: 'Best Gyms in New York', type: 'city', filter: 'new-york' },
  { title: 'Best Gyms in Los Angeles', type: 'city', filter: 'los-angeles' },
  { title: 'Best Gyms in Chicago', type: 'city', filter: 'chicago' },
  { title: 'Best Gyms in Houston', type: 'city', filter: 'houston' },
  { title: 'Best Gyms in Phoenix', type: 'city', filter: 'phoenix' },
  { title: 'Best Gyms in Philadelphia', type: 'city', filter: 'philadelphia' },
  { title: 'Best Gyms in San Antonio', type: 'city', filter: 'san-antonio' },
  { title: 'Best Gyms in San Diego', type: 'city', filter: 'san-diego' },
  { title: 'Best Gyms in Dallas', type: 'city', filter: 'dallas' },
  { title: 'Best Gyms in San Jose', type: 'city', filter: 'san-jose' },
  { title: 'Best Gyms in Austin', type: 'city', filter: 'austin' },
  { title: 'Best Gyms in San Francisco', type: 'city', filter: 'san-francisco' },
  { title: 'Best Gyms in Miami', type: 'city', filter: 'miami' },
  { title: 'Best Gyms in Las Vegas', type: 'city', filter: 'las-vegas' },
  { title: 'Best Gyms in Seattle', type: 'city', filter: 'seattle' },
  { title: 'Best Gyms in Denver', type: 'city', filter: 'denver' },
  { title: 'Best Gyms in Washington', type: 'city', filter: 'washington' },
  { title: 'Best Gyms in Boston', type: 'city', filter: 'boston' },
  { title: 'Best Gyms in Atlanta', type: 'city', filter: 'atlanta' },
  { title: 'Best Gyms in Orlando', type: 'city', filter: 'orlando' },
]

export function PopularCitiesSlider() {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const onApiChange = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return
    setApi(carouselApi)
    setCanScrollPrev(carouselApi.canScrollPrev())
    setCanScrollNext(carouselApi.canScrollNext())
    carouselApi.on('select', () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    })
  }, [])

  return (
    <section className='py-12 md:py-16'>
      <div className='container mx-auto px-4'>
        <div className='mb-6'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1 min-w-0'>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight mb-3'>
                Explore Best Gyms in Popular U.S. Cities &amp; States
              </h2>
              <p className='text-muted-foreground text-sm md:text-base max-w-3xl'>
                Discover top-rated gyms across the U.S. by browsing our most popular city and state
                guides. Whether you&apos;re looking for the best gyms in major cities like New York,
                Los Angeles, or Miami—or you want to explore statewide options like California,
                Texas, or Florida—these curated pages help you compare gyms faster and find the
                right fit for your goals, budget, and training style.
              </p>
            </div>
            <div className='flex items-center gap-2 flex-shrink-0 mt-1'>
              <Button
                variant='outline'
                size='icon'
                className='h-9 w-9 rounded-full'
                disabled={!canScrollPrev}
                onClick={() => api?.scrollPrev()}
                aria-label='Previous slide'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-9 w-9 rounded-full'
                disabled={!canScrollNext}
                onClick={() => api?.scrollNext()}
                aria-label='Next slide'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        <div className='overflow-hidden'>
          <Carousel
            opts={{ align: 'start', loop: false }}
            setApi={onApiChange}
            className='w-full overflow-visible [&>div]:overflow-visible'
          >
            <CarouselContent className='-ml-3'>
              {popularCities.map((city, index) => (
                <CarouselItem
                  key={`${city.filter}-${index}`}
                  className='pl-3 basis-[80%] sm:basis-[48%] md:basis-[35%] lg:basis-[26%]'
                >
                  <BestGymCityCard gym={city} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
