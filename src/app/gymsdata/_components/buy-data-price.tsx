'use client'

import { useMemo } from 'react'
import { FULL_DATA_PRICE_LABEL } from '../_constants'

/** Price from list-page, state-page, or city-page (backend provides per scope). */
export interface PriceFromServer {
  formattedPrice: string
  price?: number
  rowCount?: number
}

interface BuyDataPriceProps {
  /** Price from server (list-page root, state-page, city-page, or type from list-page). When set, no fetch; display this. */
  priceFromServer?: PriceFromServer | null
  /** Shown when priceFromServer is not provided or missing formattedPrice. */
  fallbackLabel?: string
  /** Optional class for the wrapper span. */
  className?: string
  /** If true, append " one-time" to formattedPrice when not already present. */
  suffixOneTime?: boolean
  /** If true, do not prepend "X rows — " when rowCount is present (e.g. for compact hero display). */
  hideRowCount?: boolean
}

/**
 * Displays checkout price from server (list-page, state-page, city-page).
 * Price is now returned by list-page (root + states + types), state-page, and city-page; no dedicated price endpoint.
 */
export function BuyDataPrice({
  priceFromServer,
  fallbackLabel = FULL_DATA_PRICE_LABEL,
  className,
  suffixOneTime = true,
  hideRowCount = false,
}: BuyDataPriceProps) {
  const label = useMemo(() => {
    const formatted = priceFromServer?.formattedPrice
    if (!formatted) return fallbackLabel
    let text = formatted
    if (suffixOneTime && !/one-time$/i.test(text)) {
      text = `${text} one-time`
    }
    if (!hideRowCount && typeof priceFromServer?.rowCount === 'number') {
      text = `${priceFromServer.rowCount.toLocaleString()} rows — ${text}`
    }
    return text
  }, [priceFromServer?.formattedPrice, priceFromServer?.rowCount, fallbackLabel, suffixOneTime, hideRowCount])

  return <span className={className}>{label}</span>
}
