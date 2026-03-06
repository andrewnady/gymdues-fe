import { ShieldCheck } from 'lucide-react'
import { ClaimBusinessButton } from './claim-business-button'

interface GymClaimBannerProps {
  gymName: string
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

export function GymClaimBanner({ gymName, isClaimed, updatedAt, gymWebsite, gymPhones }: GymClaimBannerProps) {
  if (isClaimed) {
    const formattedDate = formatUpdatedDate(updatedAt)
    return (
      <div className='flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm dark:border-green-800 dark:bg-green-950/40'>
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
    )
  }

  return (
    <div className='flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-800 dark:bg-amber-950/40'>
      <p className='text-sm text-amber-900 dark:text-amber-200'>
        <span className='font-semibold'>Are you the owner of {gymName}?</span>{' '}
        Claim this business to update your listing, manage reviews, and reach new members.
      </p>
      <div className='flex-shrink-0'>
        <ClaimBusinessButton
          gymName={gymName}
          gymWebsite={gymWebsite}
          gymPhones={gymPhones}
          label='Claim This Business'
          className='inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors whitespace-nowrap'
        />
      </div>
    </div>
  )
}
