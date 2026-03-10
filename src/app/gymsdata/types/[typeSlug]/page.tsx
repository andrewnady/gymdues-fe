import type { Metadata } from 'next'
import Link from 'next/link'
import { getListPage } from '@/lib/gymsdata-api'
import type { GymsdataTypeItem } from '@/lib/gymsdata-api'
import { getTypeBySlug, typeGymsdataPath } from '@/lib/gymsdata-utils'
import { ChevronRight, BarChart3, Target, MapPin, List } from 'lucide-react'
import { DownloadSampleButton } from '@/components/download-sample-button'
import { FULL_DATA_PRICE_LABEL } from '../../_constants'
import { BuyDataButton } from '../../_components/buy-data-button'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

type Props = { params: Promise<{ typeSlug: string }> }

function toUrlSegment(s: string): string {
  return (s ?? '').trim().toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { typeSlug } = await params
  const listPage = await getListPage()
  const types = listPage?.types ?? []
  const typeItem = getTypeBySlug(types, typeSlug ?? '')
  if (!typeItem) return { title: 'Type Not Found | Gymdues' }
  const title = `${typeItem.type} - ${typeItem.count.toLocaleString('en-US')} Verified Contacts | Gymdues`
  const description = `List of ${typeItem.type} in the United States. ${typeItem.count.toLocaleString('en-US')}+ verified contacts. Download sample or buy full dataset.`
  const slugEncoded = encodeURIComponent(toUrlSegment(typeItem.typeSlug))
  const canonical = new URL(`/gymsdata/types/${slugEncoded}`, siteUrl).toString()
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  }
}

export async function generateStaticParams() {
  const listPage = await getListPage()
  const types = listPage?.types ?? []
  return types.map((t) => ({ typeSlug: toUrlSegment(t.typeSlug) }))
}

export default async function GymsdataTypePage({ params }: Props) {
  const { typeSlug } = await params
  const listPage = await getListPage()
  const types: GymsdataTypeItem[] = listPage?.types ?? []
  const typeItem = getTypeBySlug(types, typeSlug ?? '')

  if (!typeItem) {
    return (
      <main className="min-h-screen container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">Type not found</h1>
        <Link href="/gymsdata/" className="text-primary hover:underline">
          View all types and states
        </Link>
      </main>
    )
  }

  const pctStr = typeItem.pct != null ? `${typeItem.pct}%` : null
  const typesPath = '/gymsdata/#types'
  const typeRank = types.findIndex((t) => (t.typeSlug ?? '') === (typeItem.typeSlug ?? '')) + 1
  const otherTypes = types.filter((t) => (t.typeSlug ?? '') !== (typeItem.typeSlug ?? '')).slice(0, 6)
  const maxTypeCount = Math.max(...types.map((t) => t.count), 1)

  return (
    <main className="min-h-screen">
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <nav className="text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <Link href="/gymsdata/" className="hover:text-primary">
              List of Fitness, Gym, and Health Services in United States
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-foreground font-medium">{typeItem.type}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {typeItem.type} – {typeItem.count.toLocaleString('en-US')} Verified Contacts
          </h1>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border/80 bg-card px-4 py-3 text-center">
              <p className="text-2xl font-bold tabular-nums">{typeItem.count.toLocaleString('en-US')}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Locations</p>
            </div>
            {pctStr && (
              <div className="rounded-xl border border-border/80 bg-card px-4 py-3 text-center">
                <p className="text-2xl font-bold tabular-nums">{pctStr}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Of total US</p>
              </div>
            )}
          </div>

          <div className="mt-6 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
            <p>
              There are <strong className="text-foreground">{typeItem.count.toLocaleString('en-US')}</strong>{' '}
              {typeItem.type} listings in the United States dataset.
              {pctStr && (
                <>
                  {' '}
                  This represents <strong className="text-foreground">{pctStr}</strong> of all Fitness, Gym, and Health
                  Services in our database.
                </>
              )}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <DownloadSampleButton variant="outline" filter={{ type: typeItem.type }} />
            <BuyDataButton
              href={`/gymsdata/checkout?type=${encodeURIComponent(typeItem.type)}`}
              label="Buy data"
              priceFromServer={typeItem.formattedPrice ? { formattedPrice: typeItem.formattedPrice, price: typeItem.price, rowCount: typeItem.count } : undefined}
              fallbackLabel={FULL_DATA_PRICE_LABEL}
            />
            <Link
              href={typesPath}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-5 py-2.5 text-sm font-medium hover:bg-muted"
            >
              View all types
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-14">
        {/* How this type compares */}
        {types.length > 1 && (
          <section aria-labelledby="compare-types-heading">
            <h2 id="compare-types-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" aria-hidden />
              How {typeItem.type} compares
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
              {typeItem.type} is the <strong className="text-foreground">#{typeRank}</strong> largest category
              among {types.length} business types in our US Fitness, Gym, and Health Services dataset.
            </p>
            <div className="rounded-xl border border-border/80 bg-card overflow-hidden max-w-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <tbody className="divide-y divide-border/50">
                    {types.slice(0, 8).map((t, i) => {
                      const isCurrent = (t.typeSlug ?? '') === (typeItem.typeSlug ?? '')
                      const barPct = Math.max(8, (t.count / maxTypeCount) * 100)
                      return (
                        <tr
                          key={t.typeSlug ?? i}
                          className={isCurrent ? 'bg-primary/10' : 'hover:bg-muted/40'}
                        >
                          <td className="pl-4 py-2.5 font-medium w-8 text-muted-foreground tabular-nums">
                            {i + 1}
                          </td>
                          <td className="py-2.5 min-w-[180px]">
                            {isCurrent ? (
                              <span className="font-semibold text-foreground">{t.type}</span>
                            ) : (
                              <Link
                                href={typeGymsdataPath(t.typeSlug)}
                                className="text-primary hover:underline underline-offset-2"
                              >
                                {t.type}
                              </Link>
                            )}
                          </td>
                          <td className="pr-4 py-2.5 w-24 text-right tabular-nums font-medium">
                            {t.count.toLocaleString('en-US')}
                          </td>
                          <td className="pr-4 py-2.5 w-32">
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isCurrent ? 'bg-primary' : 'bg-primary/50'}`}
                                style={{ width: `${barPct}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* What you can do with this data */}
        <section aria-labelledby="use-cases-heading">
          <h2 id="use-cases-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" aria-hidden />
            What you can do with this data
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3 max-w-2xl text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5" aria-hidden>•</span>
              <span><strong className="text-foreground">Lead generation</strong> — Build targeted lists of {typeItem.type.toLowerCase()} locations for sales or outreach.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5" aria-hidden>•</span>
              <span><strong className="text-foreground">Market sizing</strong> — Understand how many {typeItem.type.toLowerCase()} businesses exist nationally or by region.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5" aria-hidden>•</span>
              <span><strong className="text-foreground">Territory planning</strong> — Combine with state and city data to plan coverage and prioritize areas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5" aria-hidden>•</span>
              <span><strong className="text-foreground">Competitive intelligence</strong> — Analyze density and distribution of {typeItem.type.toLowerCase()} listings across the US.</span>
            </li>
          </ul>
        </section>

        {/* Related types */}
        {otherTypes.length > 0 && (
          <section aria-labelledby="related-types-heading">
            <h2 id="related-types-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
              <List className="h-5 w-5 text-primary" aria-hidden />
              Related business types
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
              Explore other categories in our Fitness, Gym, and Health Services dataset.
            </p>
            <ul className="flex flex-wrap gap-2">
              {otherTypes.map((t) => (
                <li key={t.typeSlug}>
                  <Link
                    href={typeGymsdataPath(t.typeSlug)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted hover:border-primary/30 transition-colors"
                  >
                    {t.type}
                    <span className="text-muted-foreground tabular-nums">({t.count.toLocaleString('en-US')})</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={typesPath}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  View all {types.length} types
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </li>
            </ul>
          </section>
        )}

        {/* Browse by state or type */}
        <section aria-labelledby="browse-more-heading">
          <h2 id="browse-more-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" aria-hidden />
            Browse by state or type
          </h2>
          <p className="text-muted-foreground mb-4 max-w-2xl">
            View the full list of Fitness, Gym, and Health Services by state, or see all business types on the main
            gymsdata page.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/gymsdata/"
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              All states
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href={typesPath}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              All types
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
