'use client'
import { Button } from '@/components/ui/button'
import { BestGymCityCard } from './city-card'

export function BestGymCityResult() {
  return (
    <div className='flex-1 w-full max-w-[70rem] pt-2 space-y-5'>
      <div className='text-center max-w-[50rem] mx-auto'>
        <h2 className='text-[2rem] font-semibold tracking-tight text-center leading-[100%] pb-5'>
          Where can you Find the Most Top Rated Food Restaurants?
        </h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A, earum saepe possimus assumenda
          recusandae in excepturi illo cumque sequi amet dicta dolorum accusantium ullam quam animi
          at tempore sit. Aliquid!
        </p>
      </div>
      <div className='flex items-center justify-between'>
        <h3 className='font-medium text-lg'>340 results</h3>
        <Button>Clear</Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <BestGymCityCard />
      </div>
    </div>
  )
}
