'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { getCityStates } from '@/lib/gyms-api'
import { useEffect, useState } from 'react'

interface BestGymFilterSidebarProps {
  selectedStates: string[]
  selectedCities: string[]
  onStatesChange: (states: string[]) => void
  onCitiesChange: (cities: string[]) => void
}

export function BestGymFilterSidebar({
  selectedStates,
  selectedCities,
  onStatesChange,
  onCitiesChange,
}: BestGymFilterSidebarProps) {
  const [statesExpanded, setStatesExpanded] = useState(false)
  const [citiesExpanded, setCitiesExpanded] = useState(false)
  const [statesList, setStatesList] = useState<any[]>([])
  const [citiesList, setCitiesList] = useState<any[]>([])
  const [filtersLoading, setFiltersLoading] = useState(true)

  useEffect(() => {
    setFiltersLoading(true)
    getCityStates()
      .then(({ states, cities }) => {
        setStatesList(states)
        setCitiesList(cities)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => setFiltersLoading(false))
  }, [])

  const toggleState = (value: string) => {
    if (selectedStates.includes(value)) {
      onStatesChange(selectedStates.filter((s) => s !== value))
    } else {
      onStatesChange([...selectedStates, value])
    }
  }

  const toggleCity = (value: string) => {
    if (selectedCities.includes(value)) {
      onCitiesChange(selectedCities.filter((c) => c !== value))
    } else {
      onCitiesChange([...selectedCities, value])
    }
  }

  return (
    <div className='w-full max-w-96 py-5 px-10 flex-shrink-0 space-y-8 bg-muted shadow-lg rounded-lg'>
      <Accordion
        type='multiple'
        defaultValue={['item-1', 'item-2']}
        className='w-full max-w-2xl mx-auto'
      >
        {/* States */}
        <AccordionItem value='item-1' className='border-b-0'>
          <AccordionTrigger className='text-lg font-semibold'>States</AccordionTrigger>
          <AccordionContent>
            {filtersLoading ? (
              <div className='space-y-3 pl-1'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='flex gap-3 items-center'>
                    <div className='w-5 h-5 rounded bg-gray-200 animate-pulse' />
                    <div className='h-4 bg-gray-200 animate-pulse rounded w-24' />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`space-y-3 pl-1 relative overflow-hidden ${statesExpanded ? 'max-h-fit' : 'max-h-64'}`}
              >
                {statesList.map((item, index) => {
                  const value = item.state || item.stateName
                  return (
                    <Label className='flex gap-3 items-center cursor-pointer' key={index}>
                      <input
                        type='checkbox'
                        checked={selectedStates.includes(value)}
                        onChange={() => toggleState(value)}
                        className='w-5 h-5 rounded border-gray-300 text-slate-800 focus:ring-slate-800 accent-slate-800'
                      />
                      {item.stateName}
                    </Label>
                  )
                })}
                <div
                  onClick={() => setStatesExpanded(!statesExpanded)}
                  className='bg-muted absolute bottom-0 left-0 pt-3 ps-8 w-full cursor-pointer text-primary font-semibold'
                >
                  {statesExpanded ? 'See Less' : 'See More'}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Cities */}
        <AccordionItem value='item-2' className='border-b-0'>
          <AccordionTrigger className='text-lg font-semibold'>Cities</AccordionTrigger>
          <AccordionContent>
            {filtersLoading ? (
              <div className='space-y-3 pl-1'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='flex gap-3 items-center'>
                    <div className='w-5 h-5 rounded bg-gray-200 animate-pulse' />
                    <div className='h-4 bg-gray-200 animate-pulse rounded w-28' />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`space-y-3 pl-1 relative overflow-hidden ${citiesExpanded ? 'max-h-fit' : 'max-h-64'}`}
              >
                {citiesList.map((item, index) => (
                  <Label className='flex gap-3 items-center cursor-pointer' key={index}>
                    <input
                      type='checkbox'
                      checked={selectedCities.includes(item.city)}
                      onChange={() => toggleCity(item.city)}
                      className='w-5 h-5 rounded border-gray-300 text-slate-800 focus:ring-slate-800 accent-slate-800'
                    />
                    {item.city}
                  </Label>
                ))}
                <div
                  onClick={() => setCitiesExpanded(!citiesExpanded)}
                  className='bg-muted absolute bottom-0 left-0 pt-3 ps-8 w-full cursor-pointer text-primary font-semibold'
                >
                  {citiesExpanded ? 'See Less' : 'See More'}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
