'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiRequestListingLink } from '@/lib/gym-owner-auth'

function ListYourGymModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '' })
  const emailInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailInputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newErrors = { email: '' }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (newErrors.email) {
      setErrors(newErrors)
      return
    }
    setLoading(true)
    try {
      await apiRequestListingLink(email.trim())
      // Always show success — no email enumeration
      setSubmitted(true)
    } catch {
      setErrors((prev) => ({ ...prev, email: 'Something went wrong. Please try again.' }))
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className='relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-8'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
          aria-label='Close'
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className='text-center py-4'>
            <div className='text-green-600 text-5xl mb-4'>✓</div>
            <h2 className='text-xl font-semibold mb-2'>Check your inbox</h2>
            <p className='text-muted-foreground text-sm mb-6'>
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a magic link to get started. It expires in 48 hours.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <>
            <h2 className='text-xl font-semibold mb-1'>List your gym</h2>
            <p className='text-muted-foreground text-sm mb-6'>
              Enter your details and we&apos;ll send you a secure link to get your gym listed on GymDues.
            </p>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-1.5'>
                <Label htmlFor='list-gym-email'>Email address</Label>
                <Input
                  ref={emailInputRef}
                  id='list-gym-email'
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: '' })) }}
                  disabled={loading}
                />
                {errors.email && <p className='text-red-500 text-xs'>{errors.email}</p>}
              </div>
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Sending…' : 'Send magic link'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

export function ListYourGymButton() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <Button variant='outline' onClick={() => setOpen(true)}>
        List your gym
      </Button>
      {mounted && open && <ListYourGymModal onClose={() => setOpen(false)} />}
    </>
  )
}
