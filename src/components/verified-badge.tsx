'use client'

import { useState, useRef, useEffect } from 'react'
import { BadgeCheck, X } from 'lucide-react'
import { DisputeModal } from './dispute-modal'
import { getAuthToken, apiGetMe } from '@/lib/gym-owner-auth'

interface VerifiedBadgeProps {
  gymName: string
  gymId: number
}

export function VerifiedBadge({ gymName, gymId }: VerifiedBadgeProps) {
  const [open, setOpen] = useState(false)
  const [disputeOpen, setDisputeOpen] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  // Check if the authenticated user is the owner of this gym
  useEffect(() => {
    const token = getAuthToken()
    if (!token) return
    apiGetMe(token).then((me) => {
      if (me.success && me.gym?.id === gymId) {
        setIsOwner(true)
      }
    })
  }, [gymId])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <>
      {/* Hover is tracked on the entire container so moving from badge → popover never closes it */}
      <span
        ref={ref}
        className="relative inline-flex items-center align-middle ml-2"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Badge trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={`${gymName} is a verified business`}
          className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
        >
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
          Verified
        </button>

        {/* Popover — pt-2 bridges the gap so the mouse never leaves the container */}
        {open && (
          <span className="absolute left-0 top-full z-50 block w-72 pt-2">
          <span
            className="block rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-xl"
            role="tooltip"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-2.5 top-2.5 rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-start gap-2.5 mb-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" aria-hidden />
              <p className="text-sm leading-snug">
                This business has already been claimed.{' '}
                <span className="text-muted-foreground">
                  If you believe this is an error, submit a dispute.
                </span>
              </p>
            </div>

            {!isOwner && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setDisputeOpen(true)
                }}
                className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Submit a dispute
              </button>
            )}
          </span>
          </span>
        )}
      </span>

      <DisputeModal
        open={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        gymId={gymId}
        gymName={gymName}
      />
    </>
  )
}
