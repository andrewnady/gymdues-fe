'use client'

import { useState } from 'react'
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
}

export function ClaimBusinessButton({ gymId, gymName, gymWebsite, gymPhones, className, label, onClaimed }: ClaimBusinessButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)

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
