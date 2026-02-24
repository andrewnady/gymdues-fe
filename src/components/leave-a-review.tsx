'use client'

import { Dialog, Flex } from '@radix-ui/themes'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Send, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitReviewForm } from '@/lib/reviews-api'

interface LeaveReviewProps {
  addressId: number
}

export function LeaveReview({ addressId }: LeaveReviewProps) {
  /* -------------------------------------------------------------------------- */
  /*                                  Form State                                */
  /* -------------------------------------------------------------------------- */

  const [formData, setFormData] = useState({
    name: '',
    rate: 0,
    email: '',
    text: '',
    address_id: addressId,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorReview, setErrorReview] = useState<string | null>(null)
  const [rateError, setRateError] = useState(false)
  const [success, setSuccess] = useState(false)

  /* -------------------------------------------------------------------------- */
  /*                               Form Handlers                                */
  /* -------------------------------------------------------------------------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.rate === 0) {
      setRateError(true)
      return
    }

    setIsSubmitting(true)
    setErrorReview(null)
    setRateError(false)
    setSuccess(false)

    try {
      await SubmitReviewForm(formData)

      setSuccess(true)

      setFormData({
        name: '',
        rate: 0,
        email: '',
        text: '',
        address_id: addressId,
      })
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

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>Leave a Review</Button>
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
                <label className='text-sm font-medium'>Rate</label>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, rate: star }))
                        setRateError(false)
                      }}
                      className={`w-10 h-10 rounded-md border text-sm font-semibold transition-colors ${
                        formData.rate === star
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-input hover:bg-accent'
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
                {rateError && (
                  <p className='text-sm text-destructive'>Please select a rating.</p>
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
