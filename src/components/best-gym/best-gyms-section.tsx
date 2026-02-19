'use client'

import { useState } from 'react'
import { BestGymFilterSidebar } from './filter-sidebar'
import { BestGymCityResult } from './city-result'
import { GymsPaginationMeta } from '@/lib/gyms-api'
import { gymCities } from '@/types/gym'

interface BestGymsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialStates: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialCities: any[]
  initialGyms: gymCities[]
  initialMeta: GymsPaginationMeta
}

export function BestGymsSection({
  initialStates,
  initialCities,
  initialGyms,
  initialMeta,
}: BestGymsSectionProps) {
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])

  const clearFilters = () => {
    setSelectedStates([])
    setSelectedCities([])
  }

  return (
    <div className='flex flex-col md:flex-row items-start justify-between p-4 gap-[60px]'>
      <BestGymFilterSidebar
        statesList={initialStates}
        citiesList={initialCities}
        selectedStates={selectedStates}
        selectedCities={selectedCities}
        onStatesChange={setSelectedStates}
        onCitiesChange={setSelectedCities}
      />
      <BestGymCityResult
        initialGyms={initialGyms}
        initialMeta={initialMeta}
        selectedStates={selectedStates}
        selectedCities={selectedCities}
        onClearFilters={clearFilters}
      />
    </div>
  )
}
