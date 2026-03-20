'use client'

import { useEffect, useState } from 'react'
import { Dialog, Flex } from '@radix-ui/themes'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { CheckCircle2, Send, X } from 'lucide-react'
import { submitSubscriptionRequest } from '@/lib/subscriptions-api'
import type { Plan } from '@/types/gym'

interface SubscriptionModalProps {
  plan: Plan
  trigger: React.ReactNode
}

export function SubscriptionModal({ plan, trigger }: SubscriptionModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await submitSubscriptionRequest({
        pricing_id: Number(plan.id),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        notes: formData.notes.trim() || undefined,
      })
      setFormData({ name: '', phone: '', notes: '' })
      setOpen(false)
      setShowSuccessToast(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  useEffect(() => {
    if (!showSuccessToast) return
    const timer = setTimeout(() => setShowSuccessToast(false), 4000)
    return () => clearTimeout(timer)
  }, [showSuccessToast])

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>{trigger}</Dialog.Trigger>

        <Dialog.Content maxWidth="600px">
          <div className="flex justify-between gap-1 items-center">
            <Dialog.Title>Subscribe to {plan.tier_name}</Dialog.Title>
            <Dialog.Close>
              <Button variant="secondary" className="rounded-full p-0 w-7 h-7 text-xl">
                <X />
              </Button>
            </Dialog.Close>
          </div>

          <Flex direction="column" gap="3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone <span className="text-destructive">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any questions or special requests..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {showSuccessToast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg bg-green-600 text-white text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          Thank you! Your subscription request has been sent. The gym will contact you soon.
        </div>
      )}
    </>
  )
}
