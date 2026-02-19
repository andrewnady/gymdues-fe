'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Gym } from '@/types/gym'
import { GymCard } from '@/components/gym-card'
import { getPaginatedGyms, GymsPaginationMeta } from '@/lib/gyms-api'
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
  initialGyms: Gym[]
  initialMeta: GymsPaginationMeta
}

export function BestGymsByLocation({ filter, type, initialGyms, initialMeta }: BestGymsByLocationProps) {
  const [gyms, setGyms] = useState<Gym[]>(initialGyms)
  const [, setMeta] = useState<GymsPaginationMeta | null>(initialMeta)
  const [loading, setLoading] = useState(false)
  const [page] = useState(1)
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const listItemRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const isInitialMount = useRef(true)

  // Called from map pin click or top-10 list click — scrolls to card
  const handleGymSelect = useCallback((gymId: string) => {
    setSelectedGymId((prev) => (prev === gymId ? null : gymId))
    const el = listItemRefs.current[gymId]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [])

  // IntersectionObserver: first visible card in scroll area → update map (no scroll)
  useEffect(() => {
    const root = scrollContainerRef.current
    if (!root || gyms.length === 0 || loading) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(
          (e) => e.isIntersecting && e.intersectionRatio >= 0.5
        )
        if (visible.length === 0) return
        const sorted = [...visible].sort(
          (a, b) =>
            (a.target as HTMLElement).getBoundingClientRect().top -
            (b.target as HTMLElement).getBoundingClientRect().top
        )
        const gymId = (sorted[0].target as HTMLElement).getAttribute('data-gym-id')
        if (gymId) setSelectedGymId(gymId)
      },
      { root, threshold: [0.5], rootMargin: '0px' }
    )
    gyms.forEach((gym) => {
      const el = listItemRefs.current[String(gym.id)]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [gyms, loading])

  useEffect(() => {
    // Skip the very first render — the server already provided the initial data via props.
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

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
                { label: 'Home', href: process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL ?? '/' },
                { label: `Best Gyms in ${filter}`, href: '' },
              ]}
            />
          </div>
          <h1 className='text-4xl font-bold mb-4'>{title}</h1>
          <ReadMoreText className='text-muted-foreground text-lg'>
            {type === 'state' ? (
              <>
                The best gyms in {filter}—based on ratings and reviews from Google, Yelp, and ClassPass—include{' '}
                {gyms.length > 0
                  ? gyms
                      .slice(0, 10)
                      .map((g) => g.name)
                      .join(', ')
                  : 'top-rated local gyms'}
                . The fitness culture across {filter} is shaped by 24/7 convenience, a strong strength training culture, and boutique studio variety, with popular training styles such as strength training, HIIT, Pilates, boxing, and CrossFit.
                <br />
                <br />
                In addition to large gym chains, {filter} has a wide range of Pilates, yoga, boxing, and HIIT studios and specialized facilities, making it easier to find a great fit for fat loss or muscle gain. Many members look for gyms near major metropolitan hubs and suburban centers because it aligns with work-life balance and local commuting patterns.
                <br />
                <br />
                Since {filter} spans a mix of urban and residential landscapes, training habits often shift with local climate and seasonal shifts. Whether you&apos;re a beginner, a busy professional, or a powerlifter, the best gyms in {filter} offer options from full-service health clubs to strength-focused gyms, with amenities like group classes, personal training, and saunas.
              </>
            ) : (
              <>
                The best gyms in {filter}—based on ratings and reviews from Google, Yelp, and ClassPass—include{' '}
                {gyms.length > 0
                  ? gyms
                      .slice(0, 10)
                      .map((g) => g.name)
                      .join(', ')
                  : 'top-rated local gyms'}
                . The fitness scene in {filter} is known for 24/7 convenience, a deep-rooted strength training culture, and boutique studio variety, with popular training styles like strength training, HIIT, Pilates, boxing, and CrossFit.
                <br />
                <br />
                Beyond traditional gyms, {filter} also has a strong mix of Pilates, yoga, boxing, and HIIT studios and specialized facilities, which is great if you&apos;re focused on fat loss or muscle gain. Many people choose gyms near major transit hubs and central landmarks because it&apos;s convenient for commuting and balancing a busy daily schedule.
                <br />
                <br />
                With its vibrant urban layout and local seasonal shifts, workout routines in {filter} often adapt throughout the year. Whether you&apos;re a beginner, a busy professional, or a powerlifter, the best gyms in {filter} offer everything from full-service health clubs to strength-focused gyms, plus amenities like group classes, personal training, and saunas.
              </>
            )}
          </ReadMoreText>
        </div>
      </section>

      <section>
        <div className='container mx-auto bg-white rounded-lg shadow p-6 mb-10'>
          {loading ? (
            <div className='h-8 w-64 bg-muted animate-pulse rounded-lg mb-4' />
          ) : (
            <h2 className='text-2xl font-semibold mb-4'>
              {Math.min(10, gyms.length)} Best {filter} Gyms are listed below
            </h2>
          )}
          <ol className='grid grid-cols-1 md:grid-cols-2 gap-4 list-none'>
            {loading
              ? [...Array(10)].map((_, i) => (
                  <li key={i} className='h-14 bg-muted animate-pulse rounded-lg' />
                ))
              : gyms.slice(0, 10).map((gym, index) => (
                  <li
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
                  </li>
                ))}
          </ol>
        </div>
      </section>

      <section>
        <div className='container mx-auto py-10'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1 min-w-0'>
              <div
                ref={scrollContainerRef}
                className='flex-1 min-h-0 max-h-[calc(100vh-100px)] overflow-y-auto p-4 bg-white rounded-lg shadow'
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
                  <ol className='space-y-4 list-none'>
                    {gyms.map((gym) => {
                      const isSelected =
                        selectedGymId !== null && String(gym.id) === String(selectedGymId)
                      return (
                        <li
                          key={gym.id}
                          data-gym-id={String(gym.id)}
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
                        </li>
                      )
                    })}
                  </ol>
                )}
              </div>
            </div>

            <div className='w-full lg:w-1/2 sticky top-20 h-[calc(100vh-100px)] min-h-[300px] flex flex-col bg-muted/30 rounded-lg shadow bg-white p-4'>
              <noscript>
                <div className='flex-1 flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5' viewBox='0 0 20 20' fill='currentColor'>
                    <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                  </svg>
                  <p className='text-yellow-700 text-sm'>
                    Please enable JavaScript rendering in your browser to view the interactive map
                    and full details of {Math.min(10, gyms.length)} Best {filter} Gyms.
                  </p>
                </div>
              </noscript>
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
    </div>
  )
}
