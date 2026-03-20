'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAuthToken, clearAuthToken } from '@/lib/gym-owner-auth'
import {
  apiGetLocations,
  apiGetSubscriptions,
  type GymOwnerSubscription,
  type Location,
} from '@/lib/gym-owner-profile-api'

const PER_PAGE = 15

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export default function SubscriptionsPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [addressFilter, setAddressFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<GymOwnerSubscription[]>([])
  const [meta, setMeta] = useState<{
    total: number
    per_page: number
    current_page: number
    last_page: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const t = getAuthToken()
    if (!t) {
      router.replace('/dashboard/auth/login')
      return
    }
    setToken(t)
  }, [router])

  const loadSubscriptions = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    const addressId =
      addressFilter === 'all' ? undefined : Number.parseInt(addressFilter, 10)
    const res = await apiGetSubscriptions(token, {
      address_id: Number.isFinite(addressId) ? addressId : undefined,
      page,
      per_page: PER_PAGE,
    })
    if (!res.success) {
      if (res.message?.toLowerCase().includes('unauthorized')) {
        clearAuthToken()
        router.replace('/dashboard/auth/login')
        return
      }
      setError(res.message ?? 'Failed to load subscriptions.')
      setRows([])
      setMeta(null)
    } else {
      setRows(res.data ?? [])
      setMeta(res.meta ?? null)
    }
    setLoading(false)
  }, [token, addressFilter, page, router])

  useEffect(() => {
    if (!token) return
    apiGetLocations(token).then((res) => {
      if (res.success && res.locations) setLocations(res.locations)
    })
  }, [token])

  useEffect(() => {
    loadSubscriptions()
  }, [loadSubscriptions])

  useEffect(() => {
    setPage(1)
  }, [addressFilter])

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const lastPage = meta?.last_page ?? 1

  return (
    <div className="min-h-[calc(100vh-200px)] bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Plan subscription requests</h1>
            <p className="text-sm text-muted-foreground">
              Leads from the Subscribe button on your public listing (by location & plan).
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">← Back to dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle className="text-base">Filters</CardTitle>
              <CardDescription>Optional: show requests for one location only.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="address-filter" className="text-sm text-muted-foreground">
                Location
              </label>
              <select
                id="address-filter"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={addressFilter}
                onChange={(e) => setAddressFilter(e.target.value)}
              >
                <option value="all">All locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={String(loc.id)}>
                    {loc.city || loc.address || `Location #${loc.id}`}
                    {loc.is_primary ? ' (Primary)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
        </Card>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requests</CardTitle>
            <CardDescription>
              {meta != null
                ? `${meta.total} total · page ${meta.current_page} of ${meta.last_page || 1}`
                : loading
                  ? 'Loading…'
                  : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No subscription requests yet.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-left">
                        <th className="p-3 font-medium">Date</th>
                        <th className="p-3 font-medium">Name</th>
                        <th className="p-3 font-medium">Phone</th>
                        <th className="p-3 font-medium">Plan</th>
                        <th className="p-3 font-medium">Location</th>
                        <th className="p-3 font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => {
                        const addr =
                          row.address?.full_address ||
                          [row.address?.city, row.address?.state]
                            .filter(Boolean)
                            .join(', ') ||
                          `Address #${row.address_id}`
                        return (
                          <tr key={row.id} className="border-b last:border-0 align-top">
                            <td className="p-3 whitespace-nowrap text-muted-foreground">
                              {formatDate(row.created_at)}
                            </td>
                            <td className="p-3 font-medium">{row.name}</td>
                            <td className="p-3">
                              {row.phone ? (
                                <a
                                  href={`tel:${row.phone.replace(/\s/g, '')}`}
                                  className="text-primary hover:underline"
                                >
                                  {row.phone}
                                </a>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="p-3">
                              <div className="font-medium">{row.plan?.tier_name ?? '—'}</div>
                              <div className="text-muted-foreground text-xs">
                                ${row.plan?.price ?? '—'} / {row.plan?.frequency ?? '—'}
                              </div>
                            </td>
                            <td className="p-3 max-w-[220px]">{addr}</td>
                            <td className="p-3 max-w-[200px] text-muted-foreground">
                              {row.notes?.trim() ? row.notes : '—'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {lastPage > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
                    <p className="text-sm text-muted-foreground">
                      Page {page} of {lastPage}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page >= lastPage || loading}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
