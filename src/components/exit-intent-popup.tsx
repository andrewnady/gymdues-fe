'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY = 'gymdues_exit_intent_seen'

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
    if (typeof window !== 'undefined') try { window.localStorage.setItem(STORAGE_KEY, 'true') } catch { /* noop */ }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === 'true') return
    } catch { /* noop */ }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) setOpen(true)
    }
    document.addEventListener('mouseout', handleMouseLeave)
    return () => document.removeEventListener('mouseout', handleMouseLeave)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    setLoading(false)
    setSubmitted(true)
    try { window.localStorage.setItem(STORAGE_KEY, 'true') } catch { /* noop */ }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="exit-popup-title">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        {submitted ? (
          <div className="pt-2">
            <p className="font-semibold text-foreground">Thanks!</p>
            <p className="text-sm text-muted-foreground mt-1">Check your email for the 250 free gym contacts.</p>
          </div>
        ) : (
          <>
            <h2 id="exit-popup-title" className="text-xl font-bold text-foreground pr-8">
              Wait! Get 250 Free Gym Contacts
            </h2>
            <p className="text-sm text-muted-foreground mt-2">Enter your email to get a free sample.</p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Get 250 free contacts'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
