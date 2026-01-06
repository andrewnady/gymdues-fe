import { Suspense } from 'react'
import type { Metadata } from 'next'
import { GymsPageClient } from '@/components/gyms-page-client'
import { GymSearchInput } from '@/components/gym-search-input'
import { ReadMoreText } from '@/components/read-more-text'

export const metadata: Metadata = {
  title: 'Gyms & Membership Prices by Brand & City | Gymdues',
  description:
    'Browse gyms by brand or location and see membership price ranges, plan types, and key features before you join.',
  openGraph: {
    title: 'Gyms & Membership Prices by Brand & City | Gymdues',
    description:
      'Browse gyms by brand or location and see membership price ranges, plan types, and key features before you join.',
    type: 'website',
  },
}

export default function GymsPage() {
  return (
    <div className='min-h-screen py-12'>
      <div className='container mx-auto px-4'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Browse Gyms Near You</h1>
          <ReadMoreText className='text-muted-foreground mb-6'>
            <p>
              Browsing gyms near you shouldn&apos;t feel like guesswork. With GymDues, you can explore
              nearby fitness centers and quickly compare what really matters—membership cost, plan
              options, amenities, hours, and real member feedback—so you can choose with confidence.
              Whether you&apos;re checking <strong>la fitness membership cost</strong>,{' '}
              <strong>anytime fitness membership cost</strong>,{' '}
              <strong>24 hour fitness membership cost</strong>, or local favorites like{' '}
              <strong>xsport membership cost</strong>, GymDues helps you spot the best value fast,
              avoid hidden fees, and find a gym that fits your goals, schedule, and budget.
            </p>
          </ReadMoreText>
          <div className='max-w-md'>
            <Suspense
              fallback={
                <div className='relative'>
                  <div className='h-10 w-full bg-muted animate-pulse rounded-md' />
                </div>
              }
            >
              <GymSearchInput />
            </Suspense>
          </div>
        </div>
        <GymsPageClient />
      </div>
    </div>
  )
}
