'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { BuyDatasetModal } from './buy-dataset-modal'

interface BuyDatasetButtonProps {
  className?: string
  children?: React.ReactNode
}

export function BuyDatasetButton({ className, children }: BuyDatasetButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={className}
      >
        {children ?? (
          <>
            <ShoppingCart className="h-4 w-4" aria-hidden />
            Buy dataset
          </>
        )}
      </button>
      <BuyDatasetModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
