'use client'

import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { BuyDataPrice, type PriceFromServer } from './buy-data-price'
import { FULL_DATA_PRICE_LABEL } from '../_constants'

/** Shared base classes for all "Buy data" / purchase CTAs so they look the same. */
export const BUY_BUTTON_CLASSES =
  'inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors'

interface BuyDataButtonProps {
  /** Checkout URL (with optional scope query params). */
  href: string
  /** Button label; defaults to "Buy data". */
  label?: string
  /** Price from server (list/state/city/type page). */
  priceFromServer?: PriceFromServer | null
  /** Fallback when price is missing. */
  fallbackLabel?: string
  /** Extra class names. */
  className?: string
}

/**
 * Primary CTA link for purchasing the dataset. Same format and style everywhere:
 * [Icon] Label (price)
 */
export function BuyDataButton({
  href,
  label = 'Buy data',
  priceFromServer,
  fallbackLabel = FULL_DATA_PRICE_LABEL,
  className = '',
}: BuyDataButtonProps) {
  const router = useRouter()
  return (
    <button
      type="button"
      className={`${BUY_BUTTON_CLASSES} ${className}`.trim()}
      onClick={() => router.push(href)}
    >
      <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden />
      <span>{label}</span>
      <span className="opacity-90">
        (<BuyDataPrice
          priceFromServer={priceFromServer ?? undefined}
          fallbackLabel={fallbackLabel}
          className="font-medium"
          hideRowCount
        />)
      </span>
    </button>
  )
}
