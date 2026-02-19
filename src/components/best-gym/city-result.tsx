'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { BestGymCityCard } from './city-card'
import { filterTopGyms, GymsPaginationMeta } from '@/lib/gyms-api'
import { gymCities } from '@/types/gym'

interface BestGymCityResultProps {
  initialGyms: gymCities[]
  initialMeta: GymsPaginationMeta
  selectedStates: string[]
  selectedCities: string[]
  onClearFilters: () => void
}

export function BestGymCityResult({
  initialGyms,
  initialMeta,
  selectedStates,
  selectedCities,
  onClearFilters,
}: BestGymCityResultProps) {
  const [gyms, setGyms] = useState<gymCities[]>(initialGyms)
  const [meta, setMeta] = useState<GymsPaginationMeta | null>(initialMeta)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const isInitialMount = useRef(true)

  const stateParam = selectedStates.join(',')
  const cityParam = selectedCities.join(',')

  useEffect(() => {
    setPage(1)
  }, [stateParam, cityParam])

  useEffect(() => {
    // Skip the very first render when no filters are applied and we're on page 1 —
    // the server already provided the initial data via props.
    if (isInitialMount.current && !stateParam && !cityParam && page === 1) {
      isInitialMount.current = false
      return
    }
    isInitialMount.current = false

    setLoading(true)
    filterTopGyms({ state: stateParam || undefined, city: cityParam || undefined, page, perPage: 12 })
      .then(({ gyms, meta }) => {
        setGyms(gyms as unknown as gymCities[])
        setMeta(meta)
      })
      .catch((error) => {
        console.error(error)
        setGyms([])
        setMeta(null)
      })
      .finally(() => setLoading(false))
  }, [stateParam, cityParam, page])

  const hasFilters = selectedStates.length > 0 || selectedCities.length > 0

  return (
    <div className='flex-1 w-full max-w-[70rem] pt-2 space-y-5'>
      <div className='text-center max-w-[50rem] mx-auto'>
        <h2 className='text-[2rem] font-semibold tracking-tight text-center leading-[100%] pb-5'>
          Where can you Find the Most Top Rated Gyms?
        </h2>
        <p>
          Discover the best gyms across the country. Use the filters to narrow down by state or city
          and find top-rated gyms near you.
        </p>
      </div>

      <div className='flex items-center justify-between'>
        {loading ? (
          <div className='h-6 w-28 bg-muted animate-pulse rounded' />
        ) : (
          <h3 className='font-medium text-lg'>{meta?.total ?? 0} results</h3>
        )}
        {hasFilters && (
          <Button variant='outline' onClick={onClearFilters}>Clear</Button>
        )}
      </div>

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='h-96 bg-muted animate-pulse rounded-lg' />
          ))}
        </div>
      ) : gyms.length === 0 ? (
        <p className='text-center text-muted-foreground py-10'>No gyms found. Try adjusting your filters.</p>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {gyms.map((gym, index) => (
              <BestGymCityCard key={index} gym={gym} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className='flex items-center justify-center gap-2 pt-6'>
              <Button
                variant='outline'
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className='text-sm text-muted-foreground'>
                Page {meta.current_page} of {meta.last_page}
              </span>
              <Button
                variant='outline'
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
