import type { Metadata } from 'next'
import Link from 'next/link'
import { getListPageData } from '@/lib/gyms-api'
import { Gift } from 'lucide-react'
import { Tier1EmailGatedForm } from './_components/tier1-email-gated-form'
import { Tier2FormCompletion } from './_components/tier2-form-completion'
import { Tier3Consultation } from './_components/tier3-consultation'

const title = 'Free Gym Data Samples – Lead Magnet | Gymdues'
const description =
  'Get free gym data samples: 100 random gyms (email), 500 gyms from a state (form), or 1,000 custom-filtered records with full social (consultation).'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
}

export default async function SampleDataPage() {
  const { states } = await getListPageData()
  const stateOptions = states.map((s) => ({ state: s.state, stateName: s.stateName }))

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <nav className="max-w-4xl mx-auto mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground font-medium">Free sample data</li>
          </ol>
        </nav>

        <header className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <Gift className="h-10 w-10 text-primary" aria-hidden />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Free sample data
          </h1>
          <p className="text-muted-foreground">
            Choose a tier below. More info = better sample.
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <section className="rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm" aria-labelledby="tier1-heading">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">Tier 1</span>
              <h2 id="tier1-heading" className="text-xl font-semibold">Email gated</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Name + Email</p>
            <p className="text-sm text-muted-foreground mb-4">Download 100 random gyms with basic info (name, address, city, state).</p>
            <Tier1EmailGatedForm />
          </section>

          <section className="rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm" aria-labelledby="tier2-heading">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">Tier 2</span>
              <h2 id="tier2-heading" className="text-xl font-semibold">Form completion</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-1">+ Company + Use case + State</p>
            <p className="text-sm text-muted-foreground mb-4">Download 500 gyms from your selected state. Includes phone numbers.</p>
            <Tier2FormCompletion states={stateOptions} />
          </section>

          <section className="rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm" aria-labelledby="tier3-heading">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">Tier 3</span>
              <h2 id="tier3-heading" className="text-xl font-semibold">Consultation booking</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Download 1,000 custom-filtered records. Full social media profiles included.</p>
            <Tier3Consultation />
          </section>
        </div>

        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t text-center">
          <Link href="/gymsdata" className="text-primary font-medium hover:underline">
            Browse List of Fitness, Gym, and Health Services in United States
          </Link>
        </div>
      </div>
    </main>
  )
}
