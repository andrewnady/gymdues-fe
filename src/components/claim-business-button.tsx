'use client'

import { useState, useEffect } from 'react'
import { Building2 } from 'lucide-react'
import { ClaimBusinessModal } from './claim-business-modal'

interface ClaimBusinessButtonProps {
  gymId: number
  gymName: string
  gymWebsite?: string
  gymPhones?: string[]
  className?: string
  label?: string
  onClaimed?: () => void
  /** When true, open the claim modal on mount (e.g. when arriving from For Gym Owners flow). */
  defaultOpen?: boolean
}

export function ClaimBusinessButton({ gymId, gymName, gymWebsite, gymPhones, className, label, onClaimed, defaultOpen }: ClaimBusinessButtonProps) {
  const [modalOpen, setModalOpen] = useState(!!defaultOpen)

  useEffect(() => {
    if (defaultOpen) setModalOpen(true)
  }, [defaultOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={
          className ??
          'flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors'
        }
        aria-label={`Claim ${gymName}`}
      >
        <Building2 className="h-4 w-4" aria-hidden />
        {label ?? `Claim ${gymName}`}
      </button>
      <ClaimBusinessModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onClaimed={onClaimed}
        gymId={gymId}
        gymName={gymName}
        gymWebsite={gymWebsite}
        gymPhones={gymPhones}
      />
    </>
  )
}
