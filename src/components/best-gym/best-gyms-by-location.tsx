'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Gym } from '@/types/gym'
import { GymCard } from '@/components/gym-card'
import {  getPaginatedGyms, GymsPaginationMeta } from '@/lib/gyms-api'
import { Breadcrumb } from '@/components/breadcrumb'
import { ReadMoreText } from '../read-more-text'
import { BestGymsFaqSection } from './best-gyms-faq-section'

const GymsDiscoveryMap = dynamic(
  () => import('../gyms-discovery-map').then((m) => m.GymsDiscoveryMap),
  { ssr: false },
)

interface BestGymsByLocationProps {
  filter: string
  type: string
}

export function BestGymsByLocation({ filter, type }: BestGymsByLocationProps) {
  const [gyms, setGyms] = useState<Gym[]>([])
  const [loading, setLoading] = useState(true)
  const [page] = useState(1)
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const listItemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const handleGymSelect = (gymId: string) => {
    setSelectedGymId((prev) => (prev === gymId ? null : gymId))
    const el = listItemRefs.current[gymId]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  useEffect(() => {
    async function fetchGyms() {
      setLoading(true)
      try {
        const params: {
          state?: string
          city?: string
          page: number
          perPage: number
          fields?: string
        } = {
          page,
          perPage: 12,
        }
        params.fields = 'topgyms'
        if (type === 'state') {
          params.state = filter
        } else {
          params.city = filter
        }
        const result = await getPaginatedGyms(params)
        setGyms(result.gyms)
        setMeta(result.meta)
      } catch (error) {
        console.error('Error fetching best gyms:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGyms()
  }, [filter, type, page])

  const title = `Best Gyms in ${filter}`

  return (
    <div className='min-h-screen'>
      <section className='bg-primary/5 py-20'>
        <div className='container mx-auto px-4 py-4 text-center max-w-screen-lg'>
          <div className='mb-4'>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: `Best Gyms in ${filter}`, href: '' },
              ]}
            />
          </div>
          <h1 className='text-4xl font-bold mb-4'>{title}</h1>
          <p className='text-muted-foreground text-lg'>
            Discover the top-rated gyms in {filter}. Compare membership prices, facilities, and
            reviews to find the perfect gym for you.
          </p>
        </div>
      </section>
      <section>
        <div className='container mx-auto px-4 py-10'>
          <ReadMoreText className='text-muted-foreground text-lg'>
            {type === 'state' ? (
              <>
                The best gyms in {filter}—based on ratings and reviews from {'{review_sources}'}
                —include{' '}
                {gyms.length > 0
                  ? gyms
                      .slice(0, 10)
                      .map((g) => g.name)
                      .join(', ')
                  : '{gym_list}'}
                . The fitness culture across {filter} is shaped by {'{fitness_identity_1}'},{' '}
                {'{fitness_identity_2}'}, and {'{fitness_identity_3}'}, with popular training styles
                such as {'{popular_styles}'}.
                <br />
                <br />
                In addition to large gym chains, {filter} has a wide range of {'{boutique_types}'}{' '}
                studios and specialized facilities, making it easier to find a great fit for{' '}
                {'{goal_1}'} or {'{goal_2}'}. Many members look for gyms near{' '}
                {'{state_area_examples}'} because it aligns with {'{lifestyle_reason_1}'} and{' '}
                {'{lifestyle_reason_2}'}.
                <br />
                <br />
                Since {filter} spans {'{geo_description_state}'}, training habits often shift with{' '}
                {'{seasonality_or_climate_factor}'}. Whether you&apos;re a {'{audience_1}'}, a{' '}
                {'{audience_2}'}, or a {'{audience_3}'}, the best gyms in {filter} offer options
                from {'{gym_type_1}'} to {'{gym_type_2}'}, with amenities like {'{amenity_1}'},{' '}
                {'{amenity_2}'}, and {'{amenity_3}'}.
              </>
            ) : (
              <>
                The best gyms in {filter}—based on ratings and reviews from {'{review_sources}'}
                —include{' '}
                {gyms.length > 0
                  ? gyms
                      .slice(0, 10)
                      .map((g) => g.name)
                      .join(', ')
                  : '{gym_list}'}
                . The fitness scene in {filter} is known for {'{fitness_identity_1}'},{' '}
                {'{fitness_identity_2}'}, and {'{fitness_identity_3}'}, with popular training styles
                like {'{popular_styles}'}.
                <br />
                <br />
                Beyond traditional gyms, {filter} also has a strong mix of {'{boutique_types}'}{' '}
                studios and specialized facilities, which is great if you&apos;re focused on{' '}
                {'{goal_1}'} or {'{goal_2}'}. Many people choose gyms near{' '}
                {'{local_neighborhoods_or_landmarks}'} because it&apos;s convenient for{' '}
                {'{lifestyle_reason_1}'} and {'{lifestyle_reason_2}'}.
                <br />
                <br />
                With {'{geo_description_city}'} and {'{seasonality_or_climate_factor}'}, workout
                routines in {filter} often adapt throughout the year. Whether you&apos;re a{' '}
                {'{audience_1}'}, a {'{audience_2}'}, or a {'{audience_3}'}, the best gyms in{' '}
                {filter} offer everything from {'{gym_type_1}'} to {'{gym_type_2}'}, plus amenities
                like {'{amenity_1}'}, {'{amenity_2}'}, and {'{amenity_3}'}.
              </>
            )}
          </ReadMoreText>
        </div>
      </section>

      <section>
        <div className='container mx-auto bg-white rounded-lg shadow p-6 mb-10'>
          <h2 className='text-2xl font-semibold mb-4'>
            {Math.min(10, gyms.length)} Best {filter} Gyms are listed below
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {loading
              ? [...Array(10)].map((_, i) => (
                  <div key={i} className='h-14 bg-muted animate-pulse rounded-lg' />
                ))
              : gyms.slice(0, 10).map((gym, index) => (
                  <div
                    key={gym.id}
                    className='group bg-slate-50 border border-gray-100 flex items-center gap-4 p-4 rounded-lg transition-colors duration-300 hover:bg-primary cursor-pointer'
                    onClick={() => {
                      const el = listItemRefs.current[String(gym.id)]
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        handleGymSelect(String(gym.id))
                      }
                    }}
                  >
                    <span className='bg-primary size-8 rounded-full flex items-center justify-center text-white font-sans font-bold transition-colors duration-300 group-hover:bg-slate-50 group-hover:text-primary'>
                      {index + 1}
                    </span>
                    <h3 className='text-lg font-medium transition-colors duration-300 group-hover:text-white'>
                      {gym.name}
                    </h3>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section>
        <div className='container mx-auto py-10'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1 min-w-0'>
              <div
                ref={scrollContainerRef}
                className='flex-1 min-h-0 overflow-y-auto p-4 bg-white rounded-lg shadow'
              >
                {loading && (
                  <div className='space-y-4'>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className='h-64 bg-muted animate-pulse rounded-lg' />
                    ))}
                  </div>
                )}
                {!loading && gyms.length === 0 && (
                  <p className='text-muted-foreground text-sm py-4 text-center'>
                    No gyms found. Try a different location.
                  </p>
                )}
                {!loading && gyms.length > 0 && (
                  <div className='space-y-4'>
                    {gyms.map((gym) => {
                      const isSelected =
                        selectedGymId !== null && String(gym.id) === String(selectedGymId)
                      return (
                        <div
                          key={gym.id}
                          ref={(el) => {
                            listItemRefs.current[String(gym.id)] = el
                          }}
                          className={
                            isSelected ? 'ring-2 ring-primary ring-offset-2 rounded-lg' : undefined
                          }
                        >
                          <GymCard
                            gym={gym}
                            selectMode
                            onSelect={() => handleGymSelect(String(gym.id))}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className='w-full lg:w-1/2 sticky top-20 h-[calc(100vh-100px)] min-h-[300px] flex flex-col bg-muted/30 rounded-lg shadow bg-white p-4'>
              {loading ? (
                <div className='flex-1 flex items-center justify-center text-muted-foreground'>
                  Loading map…
                </div>
              ) : (
                <div className='flex-1 min-h-[300px] w-full'>
                  <GymsDiscoveryMap
                    gyms={gyms}
                    selectedGymId={selectedGymId}
                    onGymSelect={handleGymSelect}
                    locationGroups={null}
                    selectedLocationKey={null}
                    onLocationSelect={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className='mt-16 mb-12' aria-labelledby='faq-heading'>
        <div className='container mx-auto py-10'>
          <BestGymsFaqSection location={filter} />
        </div>
      </section>

      {/* <div className='container mx-auto px-4 py-10'>
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='h-80 bg-muted animate-pulse rounded-lg' />
            ))}
          </div>
        ) : gyms.length === 0 ? (
          <div className='text-center py-16'>
            <MapPin className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
            <h2 className='text-2xl font-semibold mb-2'>No gyms found</h2>
            <p className='text-muted-foreground'>
              We couldn&apos;t find any gyms in {filter}. Try browsing other locations.
            </p>
          </div>
        ) : (
          <>
            {meta && (
              <p className='text-sm text-muted-foreground mb-6'>
                Showing {meta.from}–{meta.to} of {meta.total} gyms
              </p>
            )}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {gyms.map((gym) => (
                <GymCard key={gym.slug} gym={gym} />
              ))}
            </div>
            {meta && meta.last_page > 1 && (
              <div className='flex justify-center items-center gap-4 mt-8'>
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
      </div> */}
    </div>
  )
}
