'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { BuyDatasetModal } from './buy-dataset-modal'

interface BuyDatasetButtonProps {
  className?: string
  children?: React.ReactNode
}

/** With JS: opens modal. Without JS: link goes to /checkout (form on page). */
export function BuyDatasetButton({ className, children }: BuyDatasetButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Link
        href="/checkout"
        className={className}
        onClick={(e) => {
          e.preventDefault()
          setModalOpen(true)
        }}
        aria-label="Buy data (opens form)"
      >
        {children ?? (
          <>
            <ShoppingCart className="h-4 w-4" aria-hidden />
            Buy data
          </>
        )}
      </Link>
      <BuyDatasetModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
