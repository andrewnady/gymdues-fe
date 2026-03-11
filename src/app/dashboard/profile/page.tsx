'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getAuthToken } from '@/lib/gym-owner-auth'
import {
  apiGetLocations,
  apiGetDescription,
  apiUpdateDescription,
  apiGetPhotos,
  apiUploadPhotos,
  apiDeletePhoto,
  apiGetPricing,
  apiAddPricing,
  apiUpdatePricing,
  apiDeletePricing,
  apiGetReviews,
  apiRespondToReview,
  type Location,
  type Photo,
  type PricingPlan,
  type Review,
  type HourEntry,
  apiGetHours,
  apiUpdateHours,
} from '@/lib/gym-owner-profile-api'
import { transformApiUrl } from '@/lib/api-config'

// ─── Location Selector ────────────────────────────────────────────────────────

function LocationSelector({
  locations,
  selected,
  onChange,
}: {
  locations: Location[]
  selected: number | null
  onChange: (id: number) => void
}) {
  if (!locations.length) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Location:</span>
      {locations.map((loc) => (
        <button
          key={loc.id}
          onClick={() => onChange(loc.id)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
            selected === loc.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:border-primary/50'
          }`}
        >
          {loc.city || loc.address || `Location #${loc.id}`}
          {loc.is_primary && (
            <span className="ml-1 opacity-70">(Primary)</span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Description Tab ──────────────────────────────────────────────────────────

function DescriptionTab({ token }: { token: string }) {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    apiGetDescription(token).then((res) => {
      if (res.success) setDescription(res.description ?? '')
      setLoading(false)
    })
  }, [token])

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    const res = await apiUpdateDescription(token, description)
    setSaving(false)
    setMessage(
      res.success
        ? { type: 'success', text: 'Description saved.' }
        : { type: 'error', text: res.message ?? 'Failed to save.' },
    )
  }

  if (loading) return <TabSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gym Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This description is shared across all your locations and appears on your public listing.
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
          maxLength={5000}
          placeholder="Write a description of your gym..."
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{description.length} / 5000</span>
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? 'Saving…' : 'Save Description'}
          </Button>
        </div>
        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
            {message.text}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Photos Tab ───────────────────────────────────────────────────────────────

function PhotosTab({ token, locations }: { token: string; locations: Location[] }) {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(locations[0]?.id ?? null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fetchedLocationRef = useRef<number | null>(null)

  const loadPhotos = useCallback(async () => {
    setLoading(true)
    const res = await apiGetPhotos(token)
    if (res.success) setPhotos(res.photos ?? [])
    setLoading(false)
  }, [token])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!selectedLocation || fetchedLocationRef.current === selectedLocation) return
    fetchedLocationRef.current = selectedLocation
    loadPhotos()
  }, [selectedLocation])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setMessage(null)
    const res = await apiUploadPhotos(token, files)
    setUploading(false)
    if (res.success) {
      setMessage({ type: 'success', text: res.message ?? 'Photos uploaded.' })
      await loadPhotos()
    } else {
      setMessage({ type: 'error', text: res.message ?? 'Upload failed.' })
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this photo?')) return
    setDeletingId(id)
    const res = await apiDeletePhoto(token, id)
    setDeletingId(null)
    if (res.success) {
      setPhotos((prev) => prev.filter((p) => p.id !== id))
      setMessage({ type: 'success', text: 'Photo deleted.' })
    } else {
      setMessage({ type: 'error', text: res.message ?? 'Failed to delete.' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gym Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LocationSelector
          locations={locations}
          selected={selectedLocation}
          onChange={(id) => { setSelectedLocation(id); setMessage(null) }}
        />

        {!selectedLocation ? (
          <p className="text-sm text-muted-foreground">Select a location to manage photos.</p>
        ) : loading ? (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto my-8" />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Upload photos that appear in your public gallery. Max 10 files per upload, 5 MB each.
            </p>

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : 'Upload Photos'}
              </Button>
              <span className="text-xs text-muted-foreground">{photos.length} photo(s)</span>
            </div>

            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
                {message.text}
              </p>
            )}

            {photos.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center border border-dashed rounded-lg">
                No photos yet. Upload your first photo above.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-[4/3] rounded-lg overflow-hidden border">
                    <Image
                      src={transformApiUrl(photo.thumb_url) || transformApiUrl(photo.url)}
                      alt={photo.file_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(photo.id)}
                        disabled={deletingId === photo.id}
                        className="rounded-md bg-destructive text-destructive-foreground text-xs px-3 py-1.5 font-medium hover:bg-destructive/90 disabled:opacity-50"
                      >
                        {deletingId === photo.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Pricing Tab ──────────────────────────────────────────────────────────────

type PlanForm = { tier_name: string; price: string; frequency: string; description: string }
const emptyPlanForm = (): PlanForm => ({ tier_name: '', price: '', frequency: '', description: '' })

function PricingTab({ token, locations }: { token: string; locations: Location[] }) {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(
    locations[0]?.id ?? null,
  )
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [form, setForm] = useState<PlanForm>(emptyPlanForm())
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const fetchedLocationRef = useRef<number | null>(null)

  const loadPlans = useCallback(async (addressId: number) => {
    setLoading(true)
    const res = await apiGetPricing(token, addressId)
    if (res.success) setPlans(res.pricing ?? [])
    else setMessage({ type: 'error', text: res.message ?? 'Failed to load pricing.' })
    setLoading(false)
  }, [token])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!selectedLocation || fetchedLocationRef.current === selectedLocation) return
    fetchedLocationRef.current = selectedLocation
    loadPlans(selectedLocation)
  }, [selectedLocation])

  function openAdd() {
    setEditingPlan(null)
    setForm(emptyPlanForm())
    setShowForm(true)
  }

  function openEdit(plan: PricingPlan) {
    setEditingPlan(plan)
    setForm({
      tier_name: plan.tier_name,
      price: String(plan.price),
      frequency: plan.frequency ?? '',
      description: plan.description ?? '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedLocation) return
    setSubmitting(true)
    setMessage(null)
    const payload = {
      tier_name: form.tier_name,
      price: parseFloat(form.price),
      frequency: form.frequency || null,
      description: form.description || null,
    }
    const res = editingPlan
      ? await apiUpdatePricing(token, selectedLocation, editingPlan.id, payload)
      : await apiAddPricing(token, selectedLocation, payload)
    setSubmitting(false)
    if (res.success) {
      setMessage({ type: 'success', text: editingPlan ? 'Plan updated.' : 'Plan added.' })
      setShowForm(false)
      await loadPlans(selectedLocation)
    } else {
      setMessage({ type: 'error', text: res.message ?? 'Failed to save plan.' })
    }
  }

  async function handleDelete(planId: number) {
    if (!selectedLocation || !confirm('Delete this pricing plan?')) return
    setDeletingId(planId)
    const res = await apiDeletePricing(token, selectedLocation, planId)
    setDeletingId(null)
    if (res.success) {
      setPlans((prev) => prev.filter((p) => p.id !== planId))
      setMessage({ type: 'success', text: 'Plan deleted.' })
    } else {
      setMessage({ type: 'error', text: res.message ?? 'Failed to delete.' })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing & Membership Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LocationSelector
            locations={locations}
            selected={selectedLocation}
            onChange={(id) => { setSelectedLocation(id); setMessage(null) }}
          />

          {!selectedLocation ? (
            <p className="text-sm text-muted-foreground">Select a location to manage pricing.</p>
          ) : loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto my-8" />
          ) : (
            <>
              {message && (
                <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
                  {message.text}
                </p>
              )}

              {/* Plan list */}
              {plans.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
                  No pricing plans yet. Add your first plan below.
                </p>
              ) : (
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-start justify-between gap-4 rounded-lg border p-4"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{plan.tier_name}</span>
                          {plan.frequency && (
                            <Badge variant="secondary" className="text-xs">
                              {plan.frequency}
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg font-semibold text-primary">
                          ${Number(plan.price).toFixed(2)}
                        </p>
                        {plan.description && (
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(plan)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDelete(plan.id)}
                          disabled={deletingId === plan.id}
                        >
                          {deletingId === plan.id ? '…' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button size="sm" variant="outline" onClick={openAdd}>
                + Add Plan
              </Button>

              {/* Inline add/edit form */}
              {showForm && (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-lg border p-4 space-y-3 bg-muted/30"
                >
                  <p className="text-sm font-medium">
                    {editingPlan ? 'Edit Plan' : 'New Plan'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Plan Name *</label>
                      <Input
                        required
                        value={form.tier_name}
                        onChange={(e) => setForm({ ...form, tier_name: e.target.value })}
                        placeholder="e.g. Monthly Membership"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Price ($) *</label>
                      <Input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="49.99"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Frequency</label>
                      <Input
                        value={form.frequency}
                        onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                        placeholder="e.g. month, year, day"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs text-muted-foreground">Description</label>
                      <Input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="What's included in this plan?"
                        maxLength={1000}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={submitting}>
                      {submitting ? 'Saving…' : editingPlan ? 'Update Plan' : 'Add Plan'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Reviews Tab ──────────────────────────────────────────────────────────────

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

function HoursTab({ token, locations }: { token: string; locations: Location[] }) {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(locations[0]?.id ?? null)
  const [hours, setHours] = useState<HourEntry[]>(() =>
    DAYS.map((day) => ({ day, from: '06:00', to: '22:00', is_closed: false })),
  )
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fetchedLocationRef = useRef<number | null>(null)

  const loadHours = useCallback(async (addressId: number) => {
    setLoading(true)
    const res = await apiGetHours(token, addressId)
    if (res.success && res.hours) {
      // Days not returned by the API are treated as closed
      const merged = DAYS.map((day) => {
        const found = res.hours!.find((h) => h.day === day)
        if (found) {
          return {
            day: found.day,
            from: found.from ?? '06:00',
            to: found.to ?? '22:00',
            is_closed: found.is_closed,
          }
        }
        return { day, from: '06:00', to: '22:00', is_closed: true }
      })
      setHours(merged)
    }
    setLoading(false)
  }, [token])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!selectedLocation || fetchedLocationRef.current === selectedLocation) return
    fetchedLocationRef.current = selectedLocation
    loadHours(selectedLocation)
  }, [selectedLocation])

  function updateDay(day: string, patch: Partial<HourEntry>) {
    setHours((prev) => prev.map((h) => (h.day === day ? { ...h, ...patch } : h)))
  }

  async function handleSave() {
    if (!selectedLocation) return
    setSaving(true)
    setMessage(null)
    // Only send open days — closed days are represented by their absence
    const payload = hours
      .filter((h) => !h.is_closed)
      .map(({ day, from, to }) => ({
        day,
        from: from ?? '06:00',
        to: to ?? '22:00',
        is_closed: false,
      }))
    const res = await apiUpdateHours(token, selectedLocation, payload)
    setSaving(false)
    setMessage(
      res.success
        ? { type: 'success', text: 'Hours saved.' }
        : { type: 'error', text: res.message ?? 'Failed to save hours.' },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Operating Hours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LocationSelector
          locations={locations}
          selected={selectedLocation}
          onChange={(id) => { setSelectedLocation(id); setMessage(null) }}
        />

        {!selectedLocation ? (
          <p className="text-sm text-muted-foreground">Select a location to manage hours.</p>
        ) : loading ? (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto my-8" />
        ) : (
          <>
            <div className="space-y-2">
              {hours.map((h) => (
                <div key={h.day} className="grid grid-cols-[80px_1fr] items-center gap-3 py-1">
                  <span className="text-sm font-medium capitalize">{DAY_LABELS[h.day] ?? h.day}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={h.is_closed}
                        onChange={(e) => updateDay(h.day, { is_closed: e.target.checked })}
                        className="h-4 w-4"
                      />
                      Closed
                    </label>
                    {!h.is_closed && (
                      <>
                        <Input
                          type="time"
                          value={h.from ?? ''}
                          onChange={(e) => updateDay(h.day, { from: e.target.value })}
                          className="w-32 h-8 text-sm"
                        />
                        <span className="text-muted-foreground text-sm">to</span>
                        <Input
                          type="time"
                          value={h.to ?? ''}
                          onChange={(e) => updateDay(h.day, { to: e.target.value })}
                          className="w-32 h-8 text-sm"
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
                {message.text}
              </p>
            )}

            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Hours'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Reviews Tab ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-500 text-sm">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  )
}

function ReviewCard({ review, token, addressId, onUpdated }: {
  review: Review
  token: string
  addressId: number
  onUpdated: (updated: Review) => void
}) {
  const [responding, setResponding] = useState(false)
  const [responseText, setResponseText] = useState(review.owner_response ?? '')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRespond(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const res = await apiRespondToReview(token, review.id, responseText, addressId)
    setSaving(false)
    if (res.success) {
      onUpdated({ ...review, owner_response: res.owner_response ?? responseText, owner_responded_at: res.owner_responded_at ?? null })
      setShowForm(false)
      setResponding(false)
    } else {
      setError(res.message ?? 'Failed to post response.')
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-sm">{review.reviewer || 'Anonymous'}</p>
          <StarRating rating={review.rating} />
        </div>
        <div className="text-right shrink-0">
          <Badge variant="secondary" className="text-xs capitalize">{review.source}</Badge>
          {review.status === 'pending' && (
            <Badge className="ml-1 text-xs bg-yellow-500 text-white">Pending</Badge>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {review.reviewed_at
              ? new Date(review.reviewed_at).toLocaleDateString()
              : new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {review.text && <p className="text-sm text-muted-foreground">{review.text}</p>}

      {/* Owner response */}
      {review.owner_response && !showForm && (
        <div className="rounded-md bg-muted/50 px-3 py-2 text-sm border-l-4 border-primary/30">
          <p className="text-xs font-medium text-muted-foreground mb-1">Your response</p>
          <p>{review.owner_response}</p>
          <button
            className="text-xs text-primary hover:underline mt-1"
            onClick={() => { setShowForm(true); setResponseText(review.owner_response ?? '') }}
          >
            Edit response
          </button>
        </div>
      )}

      {/* Respond form */}
      {showForm ? (
        <form onSubmit={handleRespond} className="space-y-2">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            rows={3}
            maxLength={2000}
            required
            placeholder="Write your response..."
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Posting…' : 'Post Response'}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : !review.owner_response ? (
        <button
          className="text-xs text-primary hover:underline"
          onClick={() => { setShowForm(true); setResponding(true) }}
        >
          {responding ? '' : 'Respond to this review'}
        </button>
      ) : null}
    </div>
  )
}

function ReviewsTab({ token, locations }: { token: string; locations: Location[] }) {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(locations[0]?.id ?? null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1, per_page: 15 })
  const [status, setStatus] = useState<'all' | 'pending' | 'approved'>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchedKeyRef = useRef<string | null>(null)

  const loadReviews = useCallback(async (addressId: number, page = 1) => {
    setLoading(true)
    setError(null)
    const res = await apiGetReviews(token, addressId, { status, page, per_page: 10 })
    if (res.success) {
      setReviews(res.data ?? [])
      if (res.meta) setMeta(res.meta)
    } else {
      setError(res.message ?? 'Failed to load reviews.')
    }
    setLoading(false)
  }, [token, status])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!selectedLocation) return
    const key = `${selectedLocation}-${status}`
    if (fetchedKeyRef.current === key) return
    fetchedKeyRef.current = key
    loadReviews(selectedLocation)
  }, [selectedLocation, status])

  function handleReviewUpdated(updated: Review) {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LocationSelector
          locations={locations}
          selected={selectedLocation}
          onChange={(id) => { setSelectedLocation(id) }}
        />

        {!selectedLocation ? (
          <p className="text-sm text-muted-foreground">Select a location to view reviews.</p>
        ) : (
          <>
            {/* Filter */}
            <div className="flex items-center gap-2">
              {(['all', 'approved', 'pending'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors border ${
                    status === s
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {s}
                </button>
              ))}
              <span className="text-xs text-muted-foreground ml-auto">{meta.total} total</span>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {loading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto my-8" />
            ) : reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center border border-dashed rounded-lg">
                No reviews found.
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    token={token}
                    addressId={selectedLocation!}
                    onUpdated={handleReviewUpdated}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta.last_page > 1 && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.current_page <= 1 || loading}
                  onClick={() => selectedLocation && loadReviews(selectedLocation, meta.current_page - 1)}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.current_page >= meta.last_page || loading}
                  onClick={() => selectedLocation && loadReviews(selectedLocation, meta.current_page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TabSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-24 bg-muted rounded" />
          <div className="h-9 bg-muted rounded w-28" />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [loadingLocations, setLoadingLocations] = useState(true)

  useEffect(() => {
    const t = getAuthToken()
    if (!t) {
      router.replace('/dashboard/auth/login')
      return
    }
    setToken(t)
    apiGetLocations(t).then((res) => {
      if (res.success) setLocations(res.locations ?? [])
      setLoadingLocations(false)
    })
  }, [router])

  if (!token || loadingLocations) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Manage Profile</h1>
            <p className="text-sm text-muted-foreground">
              Update your gym&apos;s public listing information
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="description">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-6 w-full sm:w-auto">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Plans</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <DescriptionTab token={token} />
          </TabsContent>

          <TabsContent value="photos">
            <PhotosTab token={token} locations={locations} />
          </TabsContent>

          <TabsContent value="pricing">
            <PricingTab token={token} locations={locations} />
          </TabsContent>

          <TabsContent value="hours">
            <HoursTab token={token} locations={locations} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab token={token} locations={locations} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
