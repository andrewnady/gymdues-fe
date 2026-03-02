'use client'

import { ArrowRightCircle, CheckCircle2 } from 'lucide-react'
import { DownloadSampleButton } from '@/components/download-sample-button'

export function GymsdataHeroBanner() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-border/60 bg-white/95 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
      <div className="pointer-events-none absolute inset-y-[-40%] right-[-10rem] hidden w-1/2 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.16),_transparent_55%)] lg:block" />

      <div className="relative grid min-h-[320px] grid-cols-1 gap-y-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:min-h-[400px]">
        <div className="flex flex-col justify-center px-5 py-8 sm:px-6 lg:px-10 lg:py-14">
          <p className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-100 bg-emerald-50/80 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-900 mb-4 shadow-[0_6px_18px_rgba(16,185,129,0.25)]">
            250,000 Verified Gym Locations · Updated Weekly · US Coverage
          </p>

          <h1 className="text-[1.6rem] font-semibold tracking-tight text-foreground sm:text-[1.9rem] lg:text-[2.4rem] lg:leading-tight mb-3.5">
            Reach Gym Decision-Makers Before Your Competitors Do
          </h1>

          <p className="text-sm md:text-[0.95rem] text-muted-foreground max-w-xl mb-5 leading-relaxed">
            GymDues maintains one of the largest verified gym databases in the US — with owner contacts,
            equipment signals, software usage, membership pricing, and ratings data. Built for equipment
            brands, SaaS companies, and supplement wholesalers who need warm prospects, not cold lists.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mb-5">
            <DownloadSampleButton
              variant="primary"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Request a Sample Dataset
              <ArrowRightCircle className="h-4 w-4" aria-hidden />
            </DownloadSampleButton>

            <p className="text-[11px] text-muted-foreground">
              No spam. We only send a sample of real gyms in your target segment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground border-t border-border/60 pt-4 mt-1">
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
              <span>Owner / GM contact details where available</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
              <span>Equipment + software signals for smarter targeting</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
              <span>Updated weekly so your lists don&apos;t go stale</span>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground/90">
            Trusted by data, sales, and growth teams at equipment brands, SaaS companies, and supplement suppliers.
          </p>
        </div>

        <div className="relative flex items-center justify-center px-6 pb-8 lg:px-10 lg:pb-10">
          <div className="relative h-[260px] w-full max-w-sm lg:h-[340px] lg:max-w-md overflow-hidden rounded-[32px] border border-emerald-50/80 bg-gradient-to-br from-emerald-50 via-white to-sky-50 shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-banner-person.png"
              alt="Andrew Nady — GymDues Product Lead"
              className="h-full w-full object-contain object-center"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-r from-black/70 via-black/55 to-black/0 px-5 py-3 backdrop-blur-sm">
              <div className="h-8 w-8 rounded-full bg-emerald-100/90 ring-2 ring-emerald-300/90 flex items-center justify-center text-[11px] font-semibold text-emerald-950">
                AN
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white">Andrew Nady</p>
                <p className="text-[11px] text-white/80">GymDues Product Lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
