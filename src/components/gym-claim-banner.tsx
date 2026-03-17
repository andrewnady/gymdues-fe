'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { ClaimBusinessButton } from './claim-business-button'
import { revalidateGymPage } from '@/app/actions/revalidate-gym'
import { getAuthToken } from '@/lib/gym-owner-auth'

const OPEN_CLAIM_ON_MOUNT_KEY = 'gymdues.openClaimOnMount'

interface GymClaimBannerProps {
  gymId: number
  gymName: string
  gymSlug: string
  isClaimed: boolean
  updatedAt?: string
  gymWebsite?: string
  gymPhones?: string[]
}

function formatUpdatedDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export function GymClaimBanner({ gymId, gymName, gymSlug, isClaimed, updatedAt, gymWebsite, gymPhones }: GymClaimBannerProps) {
  const [claimed, setClaimed] = useState(isClaimed)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [openClaimOnMount, setOpenClaimOnMount] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsAuthenticated(!!getAuthToken())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const flag = sessionStorage.getItem(OPEN_CLAIM_ON_MOUNT_KEY)
    if (flag) {
      sessionStorage.removeItem(OPEN_CLAIM_ON_MOUNT_KEY)
      setOpenClaimOnMount(true)
    }
  }, [])

  useEffect(() => {
    if (openClaimOnMount && !claimed && bannerRef.current) {
      bannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [openClaimOnMount, claimed])

  if (claimed) {
    const formattedDate = formatUpdatedDate(updatedAt)
    return (
      <div className='flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-green-800 dark:bg-green-950/40'>
        <div className='flex items-center gap-3'>
          <ShieldCheck className='h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400' />
          <span className='text-green-800 dark:text-green-300'>
            <span className='font-semibold'>Verified Business</span> — This listing is managed by{' '}
            <span className='font-semibold'>{gymName}</span>
            {formattedDate && (
              <span className='text-green-700/70 dark:text-green-400/70'>
                {' '}· Last updated: {formattedDate}
              </span>
            )}
          </span>
        </div>
        {isAuthenticated && (
          <Link
            href='/dashboard'
            className='flex-shrink-0 text-xs font-semibold text-green-700 border border-green-400 rounded-md px-3 py-1.5 hover:bg-green-100 transition-colors whitespace-nowrap dark:text-green-300 dark:border-green-600 dark:hover:bg-green-900/30'
          >
            Manage Your Listing
          </Link>
        )}
      </div>
    )
  }

  return (
    <div ref={bannerRef} className='flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-800 dark:bg-amber-950/40'>
      <p className='text-sm text-amber-900 dark:text-amber-200'>
        <span className='font-semibold'>Are you the owner of {gymName}?</span>{' '}
        Claim this business to update your listing, manage reviews, and reach new members.
      </p>
      <div className='flex-shrink-0'>
        <ClaimBusinessButton
          gymId={gymId}
          gymName={gymName}
          gymWebsite={gymWebsite}
          gymPhones={gymPhones}
          label='Claim This Business'
          defaultOpen={openClaimOnMount}
          className='inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors whitespace-nowrap'
          onClaimed={() => {
            setClaimed(true)
            revalidateGymPage(gymSlug)
          }}
        />
      </div>
    </div>
  )
}
