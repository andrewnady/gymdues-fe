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

interface FavGymSliderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gyms: any[],
}

export function FavGymSlider({ gyms }: FavGymSliderProps) {
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
  
  if (!gyms || gyms.length === 0) return null

  return (
    <div className='w-full'>
      {/* Header row with title and arrows */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold'>Find Your Next Favorite Gym</h2>
        <div className='flex items-center gap-2'>
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

      {/* Outer div clips the overflow-visible carousel so cards peek from both sides */}
      <div className='overflow-hidden'>
        <Carousel
          opts={{ align: 'center', loop: true }}
          setApi={onApiChange}
          className='w-full overflow-visible [&>div]:overflow-visible'
        >
        <CarouselContent className='-ml-3'>
          {gyms.filter((city) => !!(city.city || city.state || city.filter)).map((city, index) => {

            const name: string = city.city || city.stateName || city.state || city.filter
            const gymCity: gymCities = {
              title: city.label || name,
              type: city.type || (city.city ? 'city' : 'state'),
              filter: city.filter || name,
            }
            return (
              <CarouselItem
                key={`${name}-${index}`}
                className='pl-3 basis-[80%] sm:basis-[48%] md:basis-[35%] lg:basis-[26%]'
              >
                <BestGymCityCard gym={gymCity} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
