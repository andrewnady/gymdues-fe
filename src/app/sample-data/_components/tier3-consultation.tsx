'use client'

import { AppLink } from '@/components/app-link'
import { Calendar } from 'lucide-react'

export function Tier3Consultation() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Book a short consultation to discuss your needs. After the call you’ll receive:
      </p>
      <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
        <li><strong className="text-foreground">1,000 custom-filtered records</strong> (state, city, category, or other filters)</li>
        <li><strong className="text-foreground">Full social media profiles</strong> included (Instagram, Facebook, etc.)</li>
      </ul>
      <AppLink
        href="/contact?tier=consultation"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Calendar className="h-4 w-4" aria-hidden />
        Book a consultation
      </AppLink>
      <p className="text-xs text-muted-foreground">
        We’ll send the 1,000-record sample after your call.
      </p>
    </div>
  )
}
