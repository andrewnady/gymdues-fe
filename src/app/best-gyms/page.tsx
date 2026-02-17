'use client'

import { BestGymCityResult } from '@/components/best-gym/city-result'
import { BestGymFilterSidebar } from '@/components/best-gym/filter-sidebar'
import { GymsPageFaqSection } from '@/components/gyms-page-faq-section'
import { ReadMoreText } from '@/components/read-more-text'
import { useState } from 'react'

export default function BestGyms() {
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])

  const clearFilters = () => {
    setSelectedStates([])
    setSelectedCities([])
  }

  return (
    <div className='min-h-screen'>
      <noscript>
        <div className='container mx-auto px-4 py-8'>
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6'>
            <h2 className='text-xl font-semibold text-yellow-800 mb-2'>JavaScript Required</h2>
            <p className='text-yellow-700'>
              This page requires JavaScript to be enabled to display gym listings and interactive
              features.
              <br />
              Please, enable your Javascript rendering for your browser to view the USA Gyms Map.
            </p>
          </div>
        </div>
      </noscript>
      <section className='bg-primary/5 py-20'>
        <div className='container mx-auto px-4 py-4 text-center max-w-screen-lg'>
          <h1 className='text-4xl font-bold mb-4'>Best Gyms in the World</h1>
          <ReadMoreText>
            Access the latest membership pricing insights for the world's most searched gyms and
            studios—like la fitness membership cost, anytime fitness membership cost, 24 hour
            fitness membership cost, lifetime gym membership cost, equinox membership cost, and
            gold's gym membership cost. We also cover high-demand regional and specialty brands
            people compare every day, including xsport membership cost, xsport fitness membership
            cost, xsport fitness price per month, princeton club membership cost, princeton club
            membership cost new berlin, newtown athletic club membership cost, newtown athletic club
            pricing, and nac membership cost. Go beyond basic "starting at" numbers to understand
            plan differences, compare cost ranges by location, and spot common fees—so you can
            choose the best-value gym confidently.
          </ReadMoreText>
        </div>
      </section>
      <div className='container mx-auto px-4 py-4'>
        <section className='py-10'>
          <div className='flex flex-col md:flex-row items-start justify-between p-4 gap-[60px]'>
            <BestGymFilterSidebar
              selectedStates={selectedStates}
              selectedCities={selectedCities}
              onStatesChange={setSelectedStates}
              onCitiesChange={setSelectedCities}
            />
            <BestGymCityResult
              selectedStates={selectedStates}
              selectedCities={selectedCities}
              onClearFilters={clearFilters}
            />
          </div>
        </section>

        {/* FAQs Section */}
        <section className='mt-16 mb-12' aria-labelledby='faq-heading'>
          <GymsPageFaqSection />
        </section>
      </div>
    </div>
  )
}
