'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { BuyDatasetModal } from './buy-dataset-modal'

interface BuyDatasetButtonProps {
  className?: string
  children?: React.ReactNode
}

/** Button opens modal; user submits form to go to /gymsdata/checkout. */
export function BuyDatasetButton({ className, children }: BuyDatasetButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={className}
        aria-label="Buy data (opens form)"
      >
        {children ?? (
          <>
            <ShoppingCart className="h-4 w-4" aria-hidden />
            Buy data
          </>
        )}
      </button>
      <BuyDatasetModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
