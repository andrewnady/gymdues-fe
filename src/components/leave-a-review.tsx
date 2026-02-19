'use client'

import { Dialog, Flex } from '@radix-ui/themes'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search, Send, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { SubmitReviewForm } from '@/lib/reviews-api'
import { getAddressesByGymId } from '@/lib/gyms-api'
import { GymAddress } from '@/types/gym'

interface LeaveReviewProps {
  gymId: string
}

export function LeaveReview({ gymId }: LeaveReviewProps) {
  /* -------------------------------------------------------------------------- */
  /*                               Address Fetch                                */
  /* -------------------------------------------------------------------------- */

  const [data, setData] = useState<GymAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAddresses = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await getAddressesByGymId(gymId, {
        page: 1,
        per_page: 100,
      })
      setData(res.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load addresses')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [gymId])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  /* -------------------------------------------------------------------------- */
  /*                                  Form State                                */
  /* -------------------------------------------------------------------------- */

  const [formData, setFormData] = useState({
    name: '',
    rate: 0,
    email: '',
    text: '',
    address_id: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorReview, setErrorReview] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  /* -------------------------------------------------------------------------- */
  /*                        Searchable Select States                             */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  /* ---------------------- Set default first address ------------------------- */

  useEffect(() => {
    if (data.length > 0) {
      setFormData((prev) => ({
        ...prev,
        address_id: String(data[0]?.id ?? ''),
      }))
      setSearch(data[0]?.full_address ?? '')
    }
  }, [data])

  /* -------------------------- Filter addresses ------------------------------ */

  const filteredAddresses = data.filter((item) =>
    (item.full_address ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  /* -------------------------------------------------------------------------- */
  /*                               Form Handlers                                */
  /* -------------------------------------------------------------------------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSubmitting(true)
    setErrorReview(null)
    setSuccess(false)

    try {
      await SubmitReviewForm(formData)

      setSuccess(true)

      setFormData({
        name: '',
        rate: 0,
        email: '',
        text: '',
        address_id: '',
      })

      setSearch('')
    } catch (err) {
      setErrorReview(
        err instanceof Error ? err.message : 'Failed to submit review. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  /* -------------------- Close dropdown on outside click --------------------- */

  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant='secondary'>Leave a Review</Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth='600px'>
          {/* Header */}
          <div className='flex justify-between gap-1 items-center'>
            <Dialog.Title>Leave a Review</Dialog.Title>

            <Dialog.Close>
              <Button variant='secondary' className='rounded-full p-0 w-7 h-7 text-xl'>
                <X />
              </Button>
            </Dialog.Close>
          </div>

          <Flex direction='column' gap='3'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Name */}
              <div className='space-y-2'>
                <label htmlFor='name' className='text-sm font-medium'>
                  Name
                </label>
                <Input
                  id='name'
                  placeholder='Your name'
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Rate */}
              <div className='space-y-2'>
                <label htmlFor='rate' className='text-sm font-medium'>
                  Rate
                </label>
                <Input
                  type='number'
                  id='rate'
                  placeholder='Rate'
                  required
                  value={formData.rate}
                  onChange={handleChange}
                  min={1}
                  max={5}
                  maxLength={1}
                />
              </div>

              {/* ---------------------------------------------------------------- */}
              {/*                     Searchable Select Field                       */}
              {/* ---------------------------------------------------------------- */}

              <div className='space-y-2 relative' onClick={(e) => e.stopPropagation()}>
                <label className='text-sm font-medium'>Select Location</label>
                <div className='relative'>
                  <Input
                    placeholder='Search location...'
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setShowDropdown(true)
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className='pe-8'
                  />
                  <Search className='absolute right-3 top-4 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                </div>

                {showDropdown && (
                  <div className='absolute z-50 w-full bg-white dark:bg-gray-900 border rounded-md shadow-md max-h-60 overflow-y-auto'>
                    {filteredAddresses.length > 0 ? (
                      filteredAddresses.map((item) => (
                        <div
                          key={item.id}
                          className='px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-sm'
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              address_id: String(item.id),
                            }))

                            setSearch(item.full_address ?? '')
                            setShowDropdown(false)
                          }}
                        >
                          {item.full_address}
                        </div>
                      ))
                    ) : (
                      <div className='px-3 py-2 text-sm text-muted-foreground'>
                        No location found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-medium'>
                  Email
                </label>
                <Input
                  id='email'
                  type='email'
                  placeholder='your.email@example.com'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Review */}
              <div className='space-y-2'>
                <label htmlFor='text' className='text-sm font-medium'>
                  Review
                </label>
                <textarea
                  id='text'
                  required
                  value={formData.text}
                  onChange={handleChange}
                  placeholder='Your review...'
                  className='flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                />
              </div>

              {/* Errors */}
              {errorReview && (
                <div className='p-3 text-sm text-destructive bg-destructive/10 rounded-md'>
                  {errorReview}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className='p-3 text-sm text-green-600 bg-green-50 rounded-md'>
                  Thank you! Your review has been sent successfully.
                </div>
              )}

              {/* Submit */}
              <Button type='submit' className='w-full' disabled={isSubmitting}>
                <Send className='mr-2 h-4 w-4' />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}
