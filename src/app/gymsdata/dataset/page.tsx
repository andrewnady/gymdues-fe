import type { Metadata } from 'next'
import Link from 'next/link'
import { getListPageData } from '@/lib/gyms-api'
import { Download } from 'lucide-react'
import { DownloadSampleButton } from '@/components/download-sample-button'
import { BuyDatasetButton } from '@/components/buy-dataset-button'
import { DatasetCharts } from '@/app/dataset/_components/dataset-charts'
import { DATASET_METRICS, SAMPLE_COLUMNS } from '@/app/dataset/_data/dataset-metrics'

const title = 'US Gym Leads Dataset – Verified Contacts | Gymdues'
const description =
  'US gym leads dataset with verified contacts. Total gyms, states covered, phone, email, website, geo. CSV/XLSX. Buy dataset or request sample.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
}

export default async function GymsdataDatasetPage() {
  const { states } = await getListPageData()
  const totalGyms = states.reduce((sum, s) => sum + (s.count || 0), 0)
  const totalStates = states.length
  const sortedStates = [...states].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  const top10States = sortedStates.slice(0, 10)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <nav className="max-w-4xl mx-auto mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/gymsdata" className="hover:text-primary">Gym database</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground font-medium">Dataset</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
            US Gym Leads Dataset
          </h1>
          <p className="text-xl text-muted-foreground">
            {totalGyms.toLocaleString('en-US')} records · {totalStates} states
          </p>
        </header>

        {/* Metrics cards */}
        <section className="max-w-4xl mx-auto mb-12" aria-label="Dataset metrics">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary tabular-nums">{totalGyms.toLocaleString('en-US')}</p>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-1">Total gyms</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary tabular-nums">{totalStates}</p>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-1">States covered</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary tabular-nums">{DATASET_METRICS.pctWithPhone}%</p>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-1">% with phone</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary tabular-nums">{DATASET_METRICS.pctWithWebsite}%</p>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-1">% with website</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary tabular-nums">{DATASET_METRICS.pctWithEmail}%</p>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-1">% with email</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary tabular-nums">{DATASET_METRICS.pctWithGeo}%</p>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-1">% with geo</p>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="max-w-4xl mx-auto mb-12" aria-labelledby="charts-heading">
          <h2 id="charts-heading" className="text-xl font-semibold mb-4">Charts</h2>
          <DatasetCharts top10States={top10States} />
        </section>

        {/* Lead segments */}
        <section className="max-w-4xl mx-auto mb-12" aria-labelledby="segments-heading">
          <h2 id="segments-heading" className="text-xl font-semibold mb-4">Lead segments</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <h3 className="font-semibold text-foreground mb-1">Gyms without websites</h3>
              <p className="text-sm text-muted-foreground">Target gyms with no website—high intent for software and web services.</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <h3 className="font-semibold text-foreground mb-1">Gyms with website + email</h3>
              <p className="text-sm text-muted-foreground">Verified contacts for email campaigns and outreach.</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <h3 className="font-semibold text-foreground mb-1">Low rating + high reviews</h3>
              <p className="text-sm text-muted-foreground">Gyms with many reviews but lower scores—opportunity for reputation services.</p>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="max-w-4xl mx-auto mb-12" aria-labelledby="what-you-get-heading">
          <h2 id="what-you-get-heading" className="text-xl font-semibold mb-4">What you get</h2>
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Columns</h3>
              <p className="text-sm text-foreground">{SAMPLE_COLUMNS.join(', ')}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Formats</h3>
              <p className="text-sm text-foreground">CSV, XLSX</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Update frequency</h3>
              <p className="text-sm text-foreground">Weekly</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sample rows preview</h3>
              <div className="overflow-x-auto rounded-lg border border-border/60 bg-muted/30 p-4">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre">
{`Gym name,Address,City,State,ZIP,Phone,Email,Website,...
LA Fitness Downtown,123 Main St,Los Angeles,CA,90001,(555) 123-4567,...
Planet Fitness Central,456 Oak Ave,Houston,TX,77001,(555) 987-6543,...`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto text-center" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="sr-only">Get the dataset</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BuyDatasetButton className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90" />
            <DownloadSampleButton variant="outline" className="rounded-xl px-6 py-3">
              <Download className="h-4 w-4" aria-hidden />
              Request sample
            </DownloadSampleButton>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/gymsdata" className="text-primary hover:underline">Browse full gym database</Link>
          </p>
        </section>
      </div>
    </main>
  )
}
