import type { Metadata } from 'next'
import { AppLink } from '@/components/app-link'
import { TrendingUp, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react'
import { getIndustryTrends } from '@/lib/gymsdata-api'
import { getGymsdataBasePath } from '../_lib/get-gymsdata-base-path'
import { NewGymsTimelineChart } from './_components/new-gyms-timeline-chart'
import { MostGrowingCitiesChart } from './_components/most-growing-cities-chart'
import { FastestGrowingCategoriesChart } from './_components/fastest-growing-categories-chart'
import { FranchiseVsIndependentChart } from './_components/franchise-vs-independent-chart'

const title = 'Gym Industry Trends – Growth Trends Dashboard | Gymdues'
const description =
  'Interactive dashboard: new gyms opened (last 12 months), most growing cities, fastest growing categories, franchise vs independent. U.S. gym industry trends.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
}

export default async function GrowthTrendsPage() {
  const [base, trends] = await Promise.all([getGymsdataBasePath(), getIndustryTrends()])
  const homeHref = base === '' ? '/' : `${base}/`
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <nav className="max-w-6xl mx-auto mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li><AppLink href={homeHref} className="hover:text-primary">Home</AppLink></li>
            <li aria-hidden>/</li>
            <li className="text-foreground font-medium">Gym Industry Trends</li>
          </ol>
        </nav>

        <header className="max-w-6xl mx-auto mb-10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Gym Industry Trends
            </h1>
          </div>
          <p className="text-muted-foreground">
            Interactive growth trends dashboard: new gyms opened, fastest-growing cities and categories, franchise vs independent over time.
          </p>
        </header>

        <div className="max-w-6xl mx-auto space-y-12">
          <section className="rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm" aria-labelledby="timeline-heading">
            <h2 id="timeline-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              New Gyms Opened (Last 12 Months)
            </h2>
            <NewGymsTimelineChart data={trends?.newGymsByMonth} />
          </section>

          <section className="rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm" aria-labelledby="cities-heading">
            <h2 id="cities-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Most Growing Cities
            </h2>
            <MostGrowingCitiesChart data={trends?.mostGrowingCities} />
          </section>

          <section className="rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm" aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Fastest Growing Categories
            </h2>
            <FastestGrowingCategoriesChart data={trends?.categories} />
          </section>

          <section className="rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm" aria-labelledby="franchise-heading">
            <h2 id="franchise-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              Franchise vs Independent
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              U.S. gym count by type over time (quarterly).
            </p>
            <FranchiseVsIndependentChart data={trends?.franchiseVsIndependent} />
          </section>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t text-center space-y-2">
          <AppLink href={homeHref} className="inline-flex items-center gap-2 rounded-xl border-2 !border-gray-700 dark:!border-gray-500 bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted text-center transition-colors">
            ← Back to Home
          </AppLink>
          {/* <span className="mx-2 text-muted-foreground">·</span>
          <Link href={competitiveHref} className="text-primary font-medium hover:underline">
            Competitive Intelligence Tool
          </Link> */}
        </div>
      </div>
    </main>
  )
}
