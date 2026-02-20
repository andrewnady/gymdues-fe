'use client'

import { Gym } from '@/types/gym'
import { GymCard } from '@/components/gym-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface NearbyGymsSliderProps {
  gyms: Gym[]
  zipCode?: string
}

export function NearbyGymsSlider({ gyms, zipCode }: NearbyGymsSliderProps) {
  if (gyms.length === 0) return null

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Gyms Nearby</h2>
        <p className="text-muted-foreground text-lg">
          {zipCode
            ? `Other gyms in the ${zipCode} area you might also like.`
            : 'Other gyms in the area you might also like.'}
        </p>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: gyms.length > 3,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 md:-ml-6">
          {gyms.map((gym) => {
            const addressObj = typeof gym.address === 'object' && gym.address !== null ? gym.address : null
            const normalizedGym = addressObj
              ? { ...gym, city: addressObj.city || gym.city, state: addressObj.state || gym.state }
              : gym
            return (
              <CarouselItem
                key={gym.id}
                className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <GymCard gym={normalizedGym} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4" />
        <CarouselNext className="hidden md:flex -right-4" />
      </Carousel>
    </section>
  )
}