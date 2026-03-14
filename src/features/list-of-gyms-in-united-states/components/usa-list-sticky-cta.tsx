'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Table2, Filter, Download, Star } from 'lucide-react'
import { DownloadSampleButton } from '@/components/download-sample-button'

const LIVE_STATES = [
  'California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania',
  'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'Arizona', 'Washington',
]

interface UsaListStickyCtaProps {
  totalGyms: number
}

export function UsaListStickyCta({ totalGyms }: UsaListStickyCtaProps) {
  const [liveState, setLiveState] = useState(LIVE_STATES[0])

  useEffect(() => {
    const id = setInterval(() => {
      setLiveState((prev) => {
        const i = LIVE_STATES.indexOf(prev)
        return LIVE_STATES[(i + 1) % LIVE_STATES.length]
      })
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const browseLabel = totalGyms >= 250000 ? '250K+' : totalGyms >= 1000 ? `${(totalGyms / 1000).toFixed(0)}K+` : `${totalGyms.toLocaleString('en-US')}+`

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Browse {browseLabel} Fitness, Gym, and Health Services
          </Link>
          <span className="hidden sm:inline text-muted-foreground/60" aria-hidden>|</span>
          <Link
            href="#filter-by-location-heading"
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            <Filter className="h-4 w-4" aria-hidden />
            Filter Now
          </Link>
          <span className="hidden sm:inline text-muted-foreground/60" aria-hidden>|</span>
          <DownloadSampleButton
            variant="outline"
            className="rounded-lg border border-input px-4 py-2.5"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download Free Sample
          </DownloadSampleButton>
          <Link href="#us-map" className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-muted md:sr-only md:focus:not-sr-only">
            <MapPin className="h-3.5 w-3.5" /> Map
          </Link>
          <Link href="#states-table" className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-muted md:sr-only md:focus:not-sr-only">
            <Table2 className="h-3.5 w-3.5" /> Table
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>1,247 businesses downloaded this month</span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            ★★★★★ 4.8/5 from 300+ reviews
          </span>
          <span className="text-primary font-medium" aria-live="polite">
            Someone just downloaded data for {liveState}
          </span>
        </div>
      </div>
    </div>
  )
}
