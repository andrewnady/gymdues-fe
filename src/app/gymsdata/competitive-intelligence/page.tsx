import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart2 } from 'lucide-react'
import { CompetitiveIntelligenceTool } from './_components/competitive-intelligence-tool'

const title = 'Competitive Intelligence Tool – Gym Market Analysis | Gymdues'
const description =
  'Enter your target market and radius to see total gyms, market leaders, gap opportunities (e.g. yoga, rock climbing), average price, and saturation score. Interactive gym market analysis.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
}

export default function CompetitiveIntelligencePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <nav className="max-w-4xl mx-auto mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/gymsdata/" className="hover:text-primary">Home</Link></li>
          </ol>
        </nav>

        <header className="max-w-4xl mx-auto mb-10">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Competitive Intelligence Tool
            </h1>
          </div>
          <p className="text-muted-foreground">
            Enter your target market and radius to see total gyms, market leaders, gap opportunities, average price, and saturation score.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <CompetitiveIntelligenceTool />
        </div>

        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t text-center">
          <Link href="/gymsdata/" className="text-primary font-medium hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
