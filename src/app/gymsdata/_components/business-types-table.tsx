'use client'

import { AppLink } from '@/components/app-link'
import { ChevronRight, Tag } from 'lucide-react'
import { typeGymsdataPath } from '@/lib/gymsdata-utils'
import type { GymsdataTypeItem } from '@/lib/gymsdata-api'

interface BusinessTypesTableProps {
  types: GymsdataTypeItem[]
  typesCovered: number
  totalGyms: number
  /** On gymsdata subdomain pass '' for clean URLs. */
  base?: string
}

export function BusinessTypesTable({ types, typesCovered, totalGyms, base }: BusinessTypesTableProps) {
  const maxPct = Math.max(...types.map((t) => t.pct ?? 0), 1)

  return (
    <div className="relative w-full max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg shadow-black/5 dark:shadow-none dark:border-border/80">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary shrink-0" aria-hidden />
            <span className="text-sm font-medium text-foreground">
              {typesCovered} business type{typesCovered !== 1 ? 's' : ''}
            </span>
          </div>
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
            Click to view type page
          </span>
        </div>

        <div className="overflow-x-auto" style={{ scrollbarGutter: 'stable' }}>
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-muted/40 border-b border-border/60">
              <tr>
                <th scope="col" className="w-12 pl-3 pr-2 py-3 text-center text-xs font-medium text-muted-foreground">#</th>
                <th scope="col" className="pl-3 pr-4 py-3 text-xs font-medium text-muted-foreground min-w-[200px]">Type</th>
                <th scope="col" className="px-3 py-3 text-right w-28 text-xs font-medium text-muted-foreground tabular-nums">Count</th>
                <th scope="col" className="pl-2 pr-3 py-3 text-xs font-medium text-muted-foreground w-40">Share</th>
                <th className="w-10 pr-3" aria-hidden />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {types.map((t, i) => (
                <tr
                  key={t.typeSlug ?? i}
                  className="group transition-colors duration-150 hover:bg-primary/5 even:bg-muted/20 even:hover:bg-primary/5"
                >
                  <td className="pl-5 pr-2 py-3 text-center text-muted-foreground font-medium tabular-nums">
                    {i + 1}
                  </td>
                  <td className="pl-3 pr-4 py-3 font-medium">
                    <AppLink
                      href={typeGymsdataPath(t.typeSlug, base)}
                      className="text-primary hover:underline underline-offset-2 inline-flex items-center gap-1.5"
                    >
                      {t.type}
                      <ChevronRight className="h-4 w-4 opacity-0 -ml-1 group-hover:opacity-70 transition-opacity shrink-0" aria-hidden />
                    </AppLink>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                    {t.count.toLocaleString('en-US')}
                  </td>
                  <td className="pl-2 pr-5 py-3">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      {t.pct != null ? (
                        <>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden min-w-[60px]">
                            <div
                              className="h-full rounded-full bg-primary/70 transition-all duration-300"
                              style={{ width: `${Math.max(4, (t.pct / maxPct) * 100)}%` }}
                              title={`${t.pct}% of total`}
                            />
                          </div>
                          <span className="text-muted-foreground tabular-nums text-xs w-10 text-right shrink-0">
                            {t.pct}%
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                  <td className="w-10 pr-3 text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 bg-muted/20 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {types.length} type{types.length !== 1 ? 's' : ''} · {totalGyms.toLocaleString('en-US')} total locations in dataset
          </span>
          <span className="text-[11px] text-muted-foreground">
            Click a type name to see details and download a sample for that category
          </span>
        </div>
      </div>
    </div>
  )
}
