'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { getStates } from '@/lib/gyms-api'
import { useEffect, useState } from 'react'

export function BestGymFilterSidebar() {
  const [statesExpanded, setStatesExpanded] = useState(false)
  const [citiesExpanded, setCitiesExpanded] = useState(false)
  const [statesList, setStatesList] = useState<any[]>([])

  useEffect(() => {
    getStates()
      .then((list) => {
        console.log(list)
        setStatesList(list)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])
  return (
    <div className='w-full max-w-96 py-5 px-10 flex-shrink-0 space-y-8 bg-muted shadow-lg rounded-lg'>
      <Accordion
        type='multiple'
        defaultValue={['item-1', 'item-2']}
        className='w-full max-w-2xl mx-auto'
      >
        {/* Accordion 1 */}
        <AccordionItem value='item-1' className='border-b-0'>
          <AccordionTrigger className='text-lg font-semibold '>States</AccordionTrigger>
          <AccordionContent>
            <div
              className={`space-y-3 pl-1 relative overflow-hidden ${statesExpanded ? 'max-h-fit' : 'max-h-64'}`}
            >
              {statesList.map((item, index) => {
                return (
                  <Label className='flex gap-3 items-center cursor-pointer' key={index}>
                    <input
                      type='checkbox'
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
          </AccordionContent>
        </AccordionItem>

        {/* Accordion 2 */}
        <AccordionItem value='item-2' className='border-b-0'>
          <AccordionTrigger className='text-lg font-semibold'>Cities</AccordionTrigger>
          <AccordionContent>
            <div
              className={`space-y-3 pl-1 relative overflow-hidden ${citiesExpanded ? 'max-h-fit' : 'max-h-64'}`}
            >
              {statesList.map((item, index) => {
                return (
                  <Label className='flex gap-3 items-center cursor-pointer' key={index}>
                    <input
                      type='checkbox'
                      className='w-5 h-5 rounded border-gray-300 text-slate-800 focus:ring-slate-800 accent-slate-800'
                    />
                    {item.stateName}
                  </Label>
                )
              })}
              <div
                onClick={() => setCitiesExpanded(!citiesExpanded)}
                className='bg-muted absolute bottom-0 left-0 pt-3 ps-8 w-full cursor-pointer text-primary font-semibold'
              >
                {citiesExpanded ? 'See Less' : 'See More'}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
