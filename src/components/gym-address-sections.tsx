'use client'

import { useEffect, useState } from 'react'
import { getAddress } from '@/lib/gyms-api'
import type { Gym, AddressDetail, OperatingHours, Plan, Review } from '@/types/gym'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GymReviewsPaginated } from '@/components/gym-reviews-paginated'
import { ReadMoreText } from '@/components/read-more-text'
import { Star } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'

function formatTimeToAmPm(timeString: string): string {
  if (!timeString) return ''
  const time = timeString.trim()
  if (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm')) {
    return time.replace(/\b0(\d):/g, '$1:').replace(/\b0(\d)\s/g, '$1 ')
  }
  const time24Regex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
  const match = time.match(time24Regex)
  if (match) {
    let hours = parseInt(match[1], 10)
    const minutes = match[2]
    const period = hours >= 12 ? 'PM' : 'AM'
    if (hours === 0) hours = 12
    else if (hours > 12) hours = hours - 12
    return `${hours}:${minutes} ${period}`
  }
  return time
}

interface GymAddressSectionsProps {
  gym: Gym
  addressId: string | null | undefined
}

/**
 * Fetches address-specific reviews, hours, and pricing when addressId is set (e.g. from map selection),
 * and renders Reviews, Hours, and Membership sections with that data or fallback to gym data.
 */
export function GymAddressSections({ gym, addressId }: GymAddressSectionsProps) {
  const [addressData, setAddressData] = useState<AddressDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolvedId = addressId != null && String(addressId).trim() ? String(addressId).trim() : null

  useEffect(() => {
    if (!resolvedId) {
      setAddressData(null)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getAddress(resolvedId)
      .then((data) => {
        if (!cancelled && data) setAddressData(data)
        if (!cancelled && !data) setAddressData(null)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load location details')
          setAddressData(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [resolvedId])

  const reviews: Review[] = addressData?.reviews ?? gym.reviews ?? []
  const hours: OperatingHours[] = addressData?.hours ?? gym.hours ?? []
  const pricing: Plan[] = addressData?.pricing ?? gym.pricing ?? []
  const reviewCount = reviews.length

  return (
    <>
      {/* Reviews and Hours - Side by Side */}
      <div className='grid md:grid-cols-3 gap-8'>
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Reviews for {gym.name}</CardTitle>
            <CardDescription>
              {loading && resolvedId ? 'Loading…' : `${reviewCount} total reviews`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && resolvedId && (
              <p className='text-destructive text-sm mb-2'>{error}</p>
            )}
            <GymReviewsPaginated reviews={reviews} gymName={gym.name} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operating Hours for {gym.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && resolvedId ? (
              <p className='text-muted-foreground text-sm'>Loading hours…</p>
            ) : (
              <div className='space-y-2 divide-y divide-border'>
                {hours.map((hour, index) => (
                  <div key={index} className='flex items-center justify-between text-sm py-2'>
                    <span className='font-medium capitalize'>{hour.day}</span>
                    <span>
                      {formatTimeToAmPm(hour.from)} - {formatTimeToAmPm(hour.to)}
                    </span>
                  </div>
                ))}
                {hours.length === 0 && (
                  <p className='text-muted-foreground text-sm'>No hours available.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Membership Plans - Full Width */}
      <section className={`py-20 bg-background ${pricing.length === 0 ? 'hidden' : ''}`}>
        <div className='container mx-auto px-4'>
          <div className='mb-12 text-center'>
            <h2 className='text-3xl md:text-4xl font-bold mb-2'>
              Membership Plans for {gym.name}
            </h2>
            <ReadMoreText className='text-muted-foreground text-lg'>
              Choose the right {gym.name} plan by comparing what&apos;s included—not just the
              monthly price. In this section, we break down {gym.name} membership tiers, typical
              perks (club access, classes, guest privileges), and common fees so you can
              understand the real cost before you join. If you&apos;re researching pricing,
              you&apos;ll also see guidance aligned with high-intent searches like{' '}
              <strong>{gym.name} membership</strong>, <strong>{gym.name} membership cost</strong>,{' '}
              <strong>{gym.name} membership cost per month</strong>,{' '}
              <strong>{gym.name} membership plans</strong>, and{' '}
              <strong>{gym.name} membership price per month</strong>—so you can pick the
              best-value plan for your goals and schedule.
            </ReadMoreText>
          </div>
          {loading && resolvedId ? (
            <p className='text-center text-muted-foreground'>Loading membership plans…</p>
          ) : (
            <div className='relative bg-muted/30 py-10'>
              <Carousel
                opts={{
                  align: 'start',
                  loop: false,
                }}
                className='w-full'
              >
                <CarouselContent className='-ml-2 md:-ml-4'>
                  {pricing.map((plan, index) => (
                    <CarouselItem key={plan.id} className='basis-full md:basis-1/2 lg:basis-1/3'>
                      <div className='relative flex h-full'>
                        <div
                          className={`relative p-6 pl-10 flex flex-col h-full w-full ${
                            index < pricing.length - 1 ? 'border-r border-border' : ''
                          }`}
                        >
                          {plan.is_popular && (
                            <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                              <Badge className='bg-green-500 text-white px-3 py-1'>
                                <Star className='h-3 w-3 mr-1 fill-white' />
                                Most Popular
                              </Badge>
                            </div>
                          )}
                          <div className='mb-4'>
                            <div className='text-4xl font-bold mb-2'>
                              {typeof plan.price === 'number'
                                ? plan.price.toFixed(2)
                                : plan.price}
                              <span className='text-lg font-normal text-muted-foreground'>
                                /{plan.frequency.toLowerCase()}
                              </span>
                            </div>
                            <h3 className='text-xl font-semibold mb-2'>{plan.tier_name}</h3>
                          </div>
                          <div
                            className='flex-1'
                            dangerouslySetInnerHTML={{ __html: plan.description }}
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='-left-12' />
                <CarouselNext className='-right-12' />
              </Carousel>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
