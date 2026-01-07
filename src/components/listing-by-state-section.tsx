import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { StateWithCount } from '@/types/gym'
import { ReadMoreText } from '@/components/read-more-text'

interface ListingByStateSectionProps {
  states: StateWithCount[]
}

// City skyline images mapping
const cityImages: Record<string, string> = {
  NY: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&q=80', // New York
  CA: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&q=80', // Los Angeles
  TX: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&h=600&fit=crop&q=80', // Texas
  FL: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop&q=80', // Miami
  IL: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80', // Chicago
}

export function ListingByStateSection({ states }: ListingByStateSectionProps) {
  return (
    <section className='py-20 bg-muted/30'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row md:justify-between mb-12 gap-4'>
          <div>
            <h2 className='text-3xl md:text-4xl font-bold mb-2'>Browse Gyms By State</h2>
            <ReadMoreText className='text-muted-foreground text-lg'>
              Start your search locally and find the best gym options near you with{' '}
              <strong>Browse Gyms By State</strong>. Instead of guessing which clubs are available
              in your area, you can explore verified listings by state and quickly compare what
              matters most—amenities, location, and especially pricing. Whether you&apos;re
              researching <strong>la fitness membership cost</strong>,{' '}
              <strong>anytime fitness membership cost</strong>,{' '}
              <strong>24 hour fitness membership cost</strong>, or city-focused memberships like{' '}
              <strong>nysc membership cost</strong> and{' '}
              <strong>new york sports club membership cost</strong>, this section helps you narrow
              down choices fast and land on the gyms that match your budget and training goals.
            </ReadMoreText>
          </div>
          <Link
            href='/gyms'
            className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-4 md:mt-0 text-nowrap'
          >
            Explore More
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {states.slice(0, 4).map((state) => (
            <Link
              key={state.state}
              href={`/gyms#state=${state.state}`}
              className='group relative overflow-hidden rounded-xl h-64 md:h-80 cursor-pointer'
            >
              <div
                className='absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110'
                style={{
                  backgroundImage: `url(${
                    cityImages[state.state] ||
                    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&q=80'
                  })`,
                }}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-6'>
                <div className='flex items-center gap-2 mb-2'>
                  <MapPin className='h-5 w-5 text-orange-500' />
                  <h3 className='text-2xl font-bold text-white'>{state.stateName}</h3>
                </div>
                <p className='text-white/90 text-sm'>
                  {state.count} {state.count === 1 ? 'Gym' : 'Gyms'} available
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

