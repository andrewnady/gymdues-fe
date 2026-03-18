'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Mail, Plus, Trash2, Upload, X } from 'lucide-react'
import { getAuthToken, apiGetMe } from '@/lib/gym-owner-auth'
import {
  apiListTeamMembers,
  apiInviteTeamMember,
  apiRevokeTeamMember,
  type TeamMember,
} from '@/lib/gym-team-api'
import { getApiBaseUrl } from '@/lib/api-config'

// ─── Constants ────────────────────────────────────────────────────────────────

const GYM_TYPES: { value: string; label: string }[] = [
  { value: 'traditional_gym',          label: 'Traditional gym' },
  { value: 'crossfit_box',             label: 'CrossFit box' },
  { value: 'yoga_pilates_studio',      label: 'Yoga/Pilates studio' },
  { value: 'martial_arts',             label: 'Martial arts' },
  { value: 'boutique_fitness',         label: 'Boutique fitness' },
  { value: 'swimming',                 label: 'Swimming' },
  { value: 'rock_climbing',            label: 'Rock climbing' },
  { value: 'personal_training_studio', label: 'Personal training studio' },
  { value: 'boxing_mma',               label: 'Boxing / MMA' },
  { value: 'cycling_studio',           label: 'Cycling studio' },
  { value: 'dance_studio',             label: 'Dance studio' },
  { value: 'other',                    label: 'Other' },
]

const CONTRACT_OPTIONS = [
  { value: 'month_to_month', label: 'Month-to-month' },
  { value: '6_months', label: '6 months' },
  { value: '12_months', label: '12 months' },
  { value: '24_months', label: '24 months' },
]

const AMENITIES_CONFIG: Record<string, string[]> = {
  Equipment: [
    'Free weights', 'Cardio machines', 'Cable machines', 'Functional training',
    'Olympic lifting platforms', 'Turf area', 'Resistance machines', 'Battle ropes',
  ],
  Classes: [
    'Group fitness', 'HIIT', 'Yoga', 'Spin/Cycling', 'Pilates', 'Boxing',
    'Personal training', 'Zumba', 'CrossFit', 'Streching',
  ],
  Facilities: [
    'Locker rooms', 'Showers', 'Sauna', 'Steam room', 'Pool',
    'Basketball court', 'Childcare', 'Cafe/Juice bar', 'Wheelchair accessible',
  ],
  Access: [
    '24/7 access', 'Keycard entry', 'Guest passes', 'Multi-location access',
    'App-based entry', 'Parking', 'Bike Storage',
  ],
}

const AMENITY_LABEL_TO_VALUE: Record<string, string> = {
  'Free weights': 'free_weights',
  'Cardio machines': 'cardio_machines',
  'Cable machines': 'cable_machines',
  'Functional training': 'functional_training',
  'Olympic lifting platforms': 'olympic_lifting_platforms',
  'Turf area': 'turf_area',
  'Resistance machines': 'resistance_machines',
  'Battle ropes': 'battle_ropes',
  'Group fitness': 'group_fitness',
  'HIIT': 'hiit',
  'Yoga': 'yoga',
  'Spin/Cycling': 'spin',
  'Pilates': 'pilates',
  'Boxing': 'boxing',
  'Personal training': 'personal_training',
  'Zumba': 'zumba',
  'CrossFit': 'crossfit',
  'Streching': 'stretching',
  'Locker rooms': 'locker_rooms',
  'Showers': 'showers',
  'Sauna': 'sauna',
  'Steam room': 'steam_room',
  'Pool': 'pool',
  'Basketball court': 'basketball_court',
  'Childcare': 'childcare',
  'Cafe/Juice bar': 'cafe',
  'Wheelchair accessible': 'wheelchair_accessible',
  '24/7 access': '24_7_access',
  'Keycard entry': 'keycard_entry',
  'Guest passes': 'guest_passes',
  'Multi-location access': 'multi_location_access',
  'App-based entry': 'app_entry',
  'Parking': 'parking',
  'Bike Storage': 'bike_storage',
}

const AMENITY_VALUE_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(AMENITY_LABEL_TO_VALUE).map(([label, value]) => [value, label])
)

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// ─── Types ────────────────────────────────────────────────────────────────────

interface DayHours {
  open: string
  close: string
  closed: boolean
  is24: boolean
}

interface PlanFormItem {
  id: number | null
  name: string
  price: string
  frequency: string
  contractLength: string
  enrollmentFee: string
  annualFee: string
}

interface ApiLocation {
  id: number
  is_primary: boolean
  street: string
  city: string
  state: string
  zip: string
  country: string
  pricing_on_request: boolean
}

interface Photo {
  id: number
  file_name: string
  url: string
  thumb_url: string
  created_at: string
}

interface Review {
  id: number
  rating: number
  text: string
  reviewer: string
  created_at: string
  owner_response: string | null
}

// ─── API helper ───────────────────────────────────────────────────────────────

async function apiFetch(url: string, token: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ─── Location Selector ────────────────────────────────────────────────────────

function LocationSelector({
  locations,
  selectedId,
  onChange,
}: {
  locations: ApiLocation[]
  selectedId: number | null
  onChange: (id: number) => void
}) {
  if (!locations.length) return null
  return (
    <div className="mb-4">
      <Label>Location</Label>
      <div className="flex flex-wrap gap-2 mt-1">
        {locations.map((loc) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => onChange(loc.id)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              selectedId === loc.id
                ? 'bg-[#16a34a] text-white border-[#16a34a]'
                : 'border-gray-300 hover:border-[#16a34a]'
            }`}
          >
            {loc.street}, {loc.city}
            {loc.is_primary && <span className="ml-1 text-xs opacity-75">(Primary)</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Gym Info Tab ─────────────────────────────────────────────────────────────

interface GymInfoForm {
  gymName: string
  gymTypes: string[]
  street: string
  city: string
  state: string
  zip: string
  phone: string
  website: string
  yearFounded: string
  description: string
}

function GymInfoTab({
  isActive,
  isOwner,
}: {
  isActive: boolean
  isOwner: boolean
}) {
  const loadedRef = useRef(false)
  const [form, setForm] = useState<GymInfoForm>({
    gymName: '', gymTypes: [], street: '', city: '', state: '',
    zip: '', phone: '', website: '', yearFounded: '', description: '',
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isActive || loadedRef.current) return
    loadedRef.current = true
    const token = getAuthToken()
    if (!token) return
    setLoading(true)
    const base = getApiBaseUrl()
    apiFetch(`${base}/api/v1/gym-owner/profile/info`, token)
      .then((data) => {
        setForm({
          gymName:     data.gym_name ?? '',
          gymTypes:    data.gym_types ?? [],
          street:      data.street ?? '',
          city:        data.city ?? '',
          state:       data.state ?? '',
          zip:         data.zip ?? '',
          phone:       data.phone ?? '',
          website:     data.website ?? '',
          yearFounded: data.year_founded ? String(data.year_founded) : '',
          description: data.description ?? '',
        })
      })
      .catch(() => setError('Failed to load gym info'))
      .finally(() => setLoading(false))
  }, [isActive])

  const set = (field: keyof GymInfoForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const toggleGymType = (value: string) => {
    setForm((prev) => ({
      ...prev,
      gymTypes: prev.gymTypes.includes(value)
        ? prev.gymTypes.filter((t) => t !== value)
        : [...prev.gymTypes, value],
    }))
  }

  const handleSave = async () => {
    const token = getAuthToken()
    if (!token) return
    if (isOwner && form.gymTypes.length === 0) {
      setError('Please select at least one gym type.')
      return
    }
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const base = getApiBaseUrl()
      if (isOwner) {
        await apiFetch(`${base}/api/v1/gym-owner/profile/info`, token, {
          method: 'PUT',
          body: JSON.stringify({
            gym_name:     form.gymName,
            gym_types:    form.gymTypes,
            description:  form.description,
            street:       form.street,
            city:         form.city,
            state:        form.state,
            zip:          form.zip,
            phone:        form.phone,
            website:      form.website || undefined,
            year_founded: form.yearFounded ? parseInt(form.yearFounded) : undefined,
          }),
        })
      } else {
        // Non-owners can only update description
        await apiFetch(`${base}/api/v1/gym-owner/profile/description`, token, {
          method: 'PUT',
          body: JSON.stringify({ description: form.description }),
        })
      }
      setSuccess(true)
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading…</div>

  const ro = !isOwner // readonly flag for non-owner fields

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gym Information</CardTitle>
            {!isOwner && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                Only the gym owner can edit all fields. You can only update the description.
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gym Name */}
          <div>
            <Label>Gym Name</Label>
            <Input
              className="mt-1"
              value={form.gymName}
              disabled={ro}
              onChange={(e) => set('gymName', e.target.value)}
            />
          </div>

          {/* Gym Types */}
          <div>
            <Label>Gym Type(s)</Label>
            <div className={`flex flex-wrap gap-2 mt-2 ${ro ? 'pointer-events-none opacity-60' : ''}`}>
              {GYM_TYPES.map((t) => {
                const active = form.gymTypes.includes(t.value)
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => !ro && toggleGymType(t.value)}
                    className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                      active
                        ? 'bg-[#16a34a] text-white border-[#16a34a]'
                        : 'border-gray-300 hover:border-[#16a34a]'
                    }`}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Street Address</Label>
              <Input
                className="mt-1"
                placeholder="123 Main St"
                value={form.street}
                disabled={ro}
                onChange={(e) => set('street', e.target.value)}
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                className="mt-1"
                placeholder="City"
                value={form.city}
                disabled={ro}
                onChange={(e) => set('city', e.target.value)}
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                className="mt-1"
                placeholder="State"
                value={form.state}
                disabled={ro}
                onChange={(e) => set('state', e.target.value)}
              />
            </div>
            <div>
              <Label>ZIP Code</Label>
              <Input
                className="mt-1"
                placeholder="ZIP"
                value={form.zip}
                disabled={ro}
                onChange={(e) => set('zip', e.target.value)}
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                className="mt-1"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                disabled={ro}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Business Website</Label>
              <Input
                className="mt-1"
                type="url"
                placeholder="https://yourgym.com"
                value={form.website}
                disabled={ro}
                onChange={(e) => set('website', e.target.value)}
              />
            </div>
            {/* Year Founded */}
            <div>
              <Label>Year Founded</Label>
              <Input
                className="mt-1"
                type="number"
                placeholder="e.g. 2010"
                value={form.yearFounded}
                disabled={ro}
                onChange={(e) => set('yearFounded', e.target.value)}
              />
            </div>
          </div>

          {/* Description — editable for everyone */}
          <div>
            <Label>Description</Label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
              rows={6}
              placeholder="Tell potential members about your gym…"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">Saved successfully.</p>}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#16a34a] hover:bg-[#15803a] text-white"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Amenities Tab ────────────────────────────────────────────────────────────

function AmenitiesTab({ isActive }: { isActive: boolean }) {
  const loadedRef = useRef(false)
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isActive || loadedRef.current) return
    loadedRef.current = true
    const token = getAuthToken()
    if (!token) return
    setLoading(true)
    const base = getApiBaseUrl()
    apiFetch(`${base}/api/v1/gym-owner/profile/amenities`, token)
      .then((data) => {
        const labels = (data.amenities as string[]).map(
          (v) => AMENITY_VALUE_TO_LABEL[v] ?? v
        )
        setSelected(labels)
      })
      .catch(() => setError('Failed to load amenities'))
      .finally(() => setLoading(false))
  }, [isActive])

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  const handleSave = async () => {
    const token = getAuthToken()
    if (!token) return
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const base = getApiBaseUrl()
      const values = selected.map((l) => AMENITY_LABEL_TO_VALUE[l] ?? l)
      await apiFetch(`${base}/api/v1/gym-owner/profile/amenities`, token, {
        method: 'PUT',
        body: JSON.stringify({ amenities: values }),
      })
      setSuccess(true)
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading…</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Amenities & Features</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(AMENITIES_CONFIG).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-medium text-gray-700 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                  const active = selected.includes(item)
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggle(item)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                        active
                          ? 'bg-[#16a34a] text-white border-[#16a34a]'
                          : 'border-gray-300 hover:border-[#16a34a]'
                      }`}
                    >
                      {active && <CheckCircle className="inline w-3 h-3 mr-1" />}
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">Saved successfully.</p>}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#16a34a] hover:bg-[#15803a] text-white"
          >
            {saving ? 'Saving…' : 'Save Amenities'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Pricing Tab ──────────────────────────────────────────────────────────────

function PricingTab({
  isActive,
  locations,
}: {
  isActive: boolean
  locations: ApiLocation[]
}) {
  const [selectedLocId, setSelectedLocId] = useState<number | null>(
    locations[0]?.id ?? null
  )
  const loadedLocRef = useRef<number | null>(null)
  const [plans, setPlans] = useState<PlanFormItem[]>([])
  const [pricingOnRequest, setPricingOnRequest] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const loadPlans = useCallback(
    async (locId: number) => {
      const token = getAuthToken()
      if (!token) return
      setLoading(true)
      setError('')
      try {
        const base = getApiBaseUrl()
        const data = await apiFetch(
          `${base}/api/v1/gym-owner/locations/${locId}/pricing`,
          token
        )
        const loc = locations.find((l) => l.id === locId)
        setPricingOnRequest(loc?.pricing_on_request ?? false)
        setPlans(
          (data.pricing as any[]).map((p) => ({
            id: p.id,
            name: p.tier_name,
            price: String(p.price),
            frequency: p.frequency,
            contractLength: p.contract_length,
            enrollmentFee: String(p.enrollment_fee ?? ''),
            annualFee: String(p.annual_fee ?? ''),
          }))
        )
      } catch {
        setError('Failed to load pricing')
      } finally {
        setLoading(false)
      }
    },
    [locations]
  )

  useEffect(() => {
    if (!isActive || selectedLocId === null) return
    if (loadedLocRef.current === selectedLocId) return
    loadedLocRef.current = selectedLocId
    loadPlans(selectedLocId)
  }, [isActive, selectedLocId, loadPlans])

  const addPlan = () => {
    setPlans((prev) => [
      ...prev,
      { id: null, name: '', price: '', frequency: 'monthly', contractLength: 'month_to_month', enrollmentFee: '', annualFee: '' },
    ])
  }

  const updatePlan = (index: number, field: keyof PlanFormItem, value: string) => {
    setPlans((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }

  const deletePlan = async (index: number) => {
    const plan = plans[index]
    if (plan.id !== null && selectedLocId !== null) {
      const token = getAuthToken()
      if (!token) return
      try {
        const base = getApiBaseUrl()
        await apiFetch(
          `${base}/api/v1/gym-owner/locations/${selectedLocId}/pricing/${plan.id}`,
          token,
          { method: 'DELETE' }
        )
      } catch {
        setError('Failed to delete plan')
        return
      }
    }
    setPlans((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (selectedLocId === null) return
    const token = getAuthToken()
    if (!token) return
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const base = getApiBaseUrl()
      for (const plan of plans) {
        const body = JSON.stringify({
          tier_name: plan.name,
          price: parseFloat(plan.price) || 0,
          frequency: plan.frequency,
          contract_length: plan.contractLength,
          enrollment_fee: parseFloat(plan.enrollmentFee) || 0,
          annual_fee: parseFloat(plan.annualFee) || 0,
        })
        if (plan.id === null) {
          await apiFetch(
            `${base}/api/v1/gym-owner/locations/${selectedLocId}/pricing`,
            token,
            { method: 'POST', body }
          )
        } else {
          await apiFetch(
            `${base}/api/v1/gym-owner/locations/${selectedLocId}/pricing/${plan.id}`,
            token,
            { method: 'PUT', body }
          )
        }
      }
      setSuccess(true)
      loadedLocRef.current = null
      loadPlans(selectedLocId)
    } catch {
      setError('Failed to save plans')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Membership Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LocationSelector
            locations={locations}
            selectedId={selectedLocId}
            onChange={(id) => {
              setSelectedLocId(id)
              loadedLocRef.current = null
            }}
          />
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              id="pricing-on-request"
              type="checkbox"
              className="rounded"
              checked={pricingOnRequest}
              onChange={async (e) => {
                const value = e.target.checked
                const token = getAuthToken()
                if (!token || selectedLocId === null) return
                try {
                  await apiFetch(
                    `${getApiBaseUrl()}/api/v1/gym-owner/locations/${selectedLocId}/pricing-on-request`,
                    token,
                    { method: 'PUT', body: JSON.stringify({ pricing_on_request: value }) }
                  )
                  setPricingOnRequest(value)
                } catch {
                  setError('Failed to update pricing preference')
                }
              }}
            />
            <label htmlFor="pricing-on-request" className="text-sm text-gray-700 cursor-pointer select-none">
              Pricing on request — hide listed prices and ask members to contact the gym
            </label>
          </div>
          {loading ? (
            <div className="text-center text-gray-500 py-4">Loading…</div>
          ) : (
            <>
              {plans.map((plan, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => deletePlan(index)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Plan Name</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. Basic, Premium"
                        value={plan.name}
                        onChange={(e) => updatePlan(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        className="mt-1"
                        type="number"
                        placeholder="0.00"
                        value={plan.price}
                        onChange={(e) => updatePlan(index, 'price', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Frequency</Label>
                      <select
                        className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                        value={plan.frequency}
                        onChange={(e) => updatePlan(index, 'frequency', e.target.value)}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="annually">Annually</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                    <div>
                      <Label>Contract Length</Label>
                      <select
                        className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                        value={plan.contractLength}
                        onChange={(e) => updatePlan(index, 'contractLength', e.target.value)}
                      >
                        {CONTRACT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Enrollment Fee</Label>
                      <Input
                        className="mt-1"
                        type="number"
                        placeholder="0.00"
                        value={plan.enrollmentFee}
                        onChange={(e) => updatePlan(index, 'enrollmentFee', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Annual Fee</Label>
                      <Input
                        className="mt-1"
                        type="number"
                        placeholder="0.00"
                        value={plan.annualFee}
                        onChange={(e) => updatePlan(index, 'annualFee', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPlan}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#16a34a] hover:text-[#16a34a] flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Plan
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">Saved successfully.</p>}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#16a34a] hover:bg-[#15803a] text-white"
              >
                {saving ? 'Saving…' : 'Save All Plans'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Hours Tab ────────────────────────────────────────────────────────────────

function HoursTab({
  isActive,
  locations,
}: {
  isActive: boolean
  locations: ApiLocation[]
}) {
  const [selectedLocId, setSelectedLocId] = useState<number | null>(
    locations[0]?.id ?? null
  )
  const loadedLocRef = useRef<number | null>(null)
  const defaultHours = (): Record<string, DayHours> =>
    Object.fromEntries(
      DAYS.map((d) => [d, { open: '06:00', close: '22:00', closed: false, is24: false }])
    )
  const [hours, setHours] = useState<Record<string, DayHours>>(defaultHours())
  const [sameHours, setSameHours] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const loadHours = useCallback(async (locId: number) => {
    const token = getAuthToken()
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const base = getApiBaseUrl()
      const data = await apiFetch(
        `${base}/api/v1/gym-owner/locations/${locId}/hours`,
        token
      )
      const newHours = defaultHours()
      for (const entry of data.hours as any[]) {
        const day = DAYS.find((d) => d.toLowerCase() === entry.day?.toLowerCase())
        if (!day) continue
        newHours[day] = {
          open: entry.from ?? '06:00',
          close: entry.to ?? '22:00',
          closed: !!entry.is_closed,
          is24: !!entry.is_24,
        }
      }
      setHours(newHours)
    } catch {
      setError('Failed to load hours')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isActive || selectedLocId === null) return
    if (loadedLocRef.current === selectedLocId) return
    loadedLocRef.current = selectedLocId
    loadHours(selectedLocId)
  }, [isActive, selectedLocId, loadHours])

  const updateDay = (day: string, field: keyof DayHours, value: string | boolean) => {
    setHours((prev) => {
      const updated = { ...prev, [day]: { ...prev[day], [field]: value } }
      if (sameHours && field !== 'closed' && field !== 'is24') {
        DAYS.forEach((d) => { updated[d] = { ...updated[d], [field]: value } })
      }
      return updated
    })
  }

  const applySameHours = (enable: boolean) => {
    setSameHours(enable)
    if (enable) {
      const mon = hours['Monday']
      setHours((prev) => {
        const next = { ...prev }
        DAYS.forEach((d) => { next[d] = { ...next[d], open: mon.open, close: mon.close } })
        return next
      })
    }
  }

  const handleSave = async () => {
    if (selectedLocId === null) return
    const token = getAuthToken()
    if (!token) return
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const base = getApiBaseUrl()
      const hoursPayload = DAYS.map((day) => ({
        day: day.toLowerCase(),
        from: hours[day].closed || hours[day].is24 ? null : hours[day].open,
        to: hours[day].closed || hours[day].is24 ? null : hours[day].close,
        is_closed: hours[day].closed,
        is_24: hours[day].is24,
      }))
      await apiFetch(
        `${base}/api/v1/gym-owner/locations/${selectedLocId}/hours`,
        token,
        { method: 'PUT', body: JSON.stringify({ hours: hoursPayload }) }
      )
      setSuccess(true)
    } catch {
      setError('Failed to save hours')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Operating Hours</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <LocationSelector
            locations={locations}
            selectedId={selectedLocId}
            onChange={(id) => {
              setSelectedLocId(id)
              loadedLocRef.current = null
            }}
          />
          {loading ? (
            <div className="text-center text-gray-500 py-4">Loading…</div>
          ) : (
            <>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameHours}
                  onChange={(e) => applySameHours(e.target.checked)}
                  className="rounded"
                />
                Apply Monday hours to all days
              </label>
              <div className="space-y-3">
                {DAYS.map((day) => (
                  <div key={day} className="flex items-center gap-3 flex-wrap">
                    <span className="w-24 text-sm font-medium text-gray-700">{day}</span>
                    <label className="flex items-center gap-1.5 text-sm">
                      <input
                        type="checkbox"
                        checked={hours[day].closed}
                        onChange={(e) => updateDay(day, 'closed', e.target.checked)}
                        className="rounded"
                      />
                      Closed
                    </label>
                    <label className="flex items-center gap-1.5 text-sm">
                      <input
                        type="checkbox"
                        checked={hours[day].is24}
                        onChange={(e) => updateDay(day, 'is24', e.target.checked)}
                        className="rounded"
                      />
                      24 hrs
                    </label>
                    {!hours[day].closed && !hours[day].is24 && (
                      <>
                        <Input
                          type="time"
                          className="w-32"
                          value={hours[day].open}
                          onChange={(e) => updateDay(day, 'open', e.target.value)}
                        />
                        <span className="text-sm text-gray-400">–</span>
                        <Input
                          type="time"
                          className="w-32"
                          value={hours[day].close}
                          onChange={(e) => updateDay(day, 'close', e.target.value)}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">Saved successfully.</p>}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#16a34a] hover:bg-[#15803a] text-white"
              >
                {saving ? 'Saving…' : 'Save Hours'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Photos Tab ───────────────────────────────────────────────────────────────

type SinglePhotoType = 'logo' | 'featured_image'

function SingleImageUpload({
  label,
  description,
  type,
  current,
  onUploaded,
  onDeleted,
}: {
  label: string
  description: string
  type: SinglePhotoType
  current: Photo | null
  onUploaded: (file: Photo) => void
  onDeleted: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File | null) => {
    if (!file) return
    const token = getAuthToken()
    if (!token) return
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('type', type)
      form.append('photo', file)
      const data = await apiFetch(
        `${getApiBaseUrl()}/api/v1/gym-owner/profile/photos`,
        token,
        { method: 'POST', body: form }
      )
      if (data.file) onUploaded(data.file)
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!current) return
    const token = getAuthToken()
    if (!token) return
    try {
      await apiFetch(
        `${getApiBaseUrl()}/api/v1/gym-owner/profile/photos/${current.id}?type=${type}`,
        token,
        { method: 'DELETE' }
      )
      onDeleted()
    } catch {
      setError('Failed to delete')
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <p className="text-xs text-gray-400 mb-3">{description}</p>
      {current ? (
        <div className="relative inline-block group">
          <Image
            src={current.thumb_url || current.url}
            alt={label}
            width={160}
            height={160}
            className="rounded-lg object-cover border"
          />
          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#16a34a] transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-6 h-6 text-gray-400 mb-1" />
          <span className="text-xs text-gray-400">Upload</span>
        </div>
      )}
      {current && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs text-[#16a34a] hover:underline block"
        >
          Replace
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
      />
      {uploading && <p className="text-xs text-gray-500 mt-1">Uploading…</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function PhotosTab({ isActive }: { isActive: boolean }) {
  const loadedRef = useRef(false)
  const [logo, setLogo] = useState<Photo | null>(null)
  const [featuredImage, setFeaturedImage] = useState<Photo | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadPhotos = useCallback(async () => {
    const token = getAuthToken()
    if (!token) return
    setLoading(true)
    try {
      const data = await apiFetch(`${getApiBaseUrl()}/api/v1/gym-owner/profile/photos`, token)
      setLogo(data.logo ?? null)
      setFeaturedImage(data.featured_image ?? null)
      setPhotos(data.photos ?? [])
    } catch {
      setError('Failed to load photos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isActive || loadedRef.current) return
    loadedRef.current = true
    loadPhotos()
  }, [isActive, loadPhotos])

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const token = getAuthToken()
    if (!token) return
    setUploading(true)
    setError('')
    setSuccess(false)
    try {
      const form = new FormData()
      form.append('type', 'gallery')
      Array.from(files).forEach((f) => form.append('photos[]', f))
      const data = await apiFetch(`${getApiBaseUrl()}/api/v1/gym-owner/profile/photos`, token, {
        method: 'POST',
        body: form,
      })
      setPhotos((prev) => [...prev, ...(data.uploaded ?? [])])
      setSuccess(true)
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryDelete = async (id: number) => {
    const token = getAuthToken()
    if (!token) return
    try {
      await apiFetch(`${getApiBaseUrl()}/api/v1/gym-owner/profile/photos/${id}`, token, {
        method: 'DELETE',
      })
      setPhotos((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError('Failed to delete photo')
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading…</div>

  return (
    <div className="space-y-6">
      {/* Logo & Featured Image */}
      <Card>
        <CardHeader><CardTitle>Logo &amp; Featured Image</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-10">
          <SingleImageUpload
            label="Gym Logo"
            description="Square format recommended · JPG, PNG, WebP · Max 5 MB"
            type="logo"
            current={logo}
            onUploaded={(file) => setLogo(file)}
            onDeleted={() => setLogo(null)}
          />
          <SingleImageUpload
            label="Featured Image"
            description="Shown as the main banner on your gym listing · JPG, PNG, WebP · Max 5 MB"
            type="featured_image"
            current={featuredImage}
            onUploaded={(file) => setFeaturedImage(file)}
            onDeleted={() => setFeaturedImage(null)}
          />
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card>
        <CardHeader><CardTitle>Photo Gallery</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#16a34a] cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleGalleryUpload(e.dataTransfer.files)
            }}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Click or drag photos to upload</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · Max 5 MB each · Up to 10 at once</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleGalleryUpload(e.target.files)}
            />
          </div>
          {uploading && <p className="text-sm text-gray-500">Uploading…</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">Uploaded successfully.</p>}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                  <Image
                    src={photo.thumb_url || photo.url}
                    alt={photo.file_name}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleGalleryDelete(photo.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Reviews Tab ──────────────────────────────────────────────────────────────

function ReviewsTab({
  isActive,
  locations,
}: {
  isActive: boolean
  locations: ApiLocation[]
}) {
  const [selectedLocId, setSelectedLocId] = useState<number | null>(
    locations[0]?.id ?? null
  )
  const loadedLocRef = useRef<number | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [meta, setMeta] = useState<{ current_page: number; last_page: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [responding, setResponding] = useState<Record<number, string>>({})
  const [responseTexts, setResponseTexts] = useState<Record<number, string>>({})

  const loadReviews = useCallback(async (locId: number, page = 1, append = false) => {
    const token = getAuthToken()
    if (!token) return
    if (page === 1) setLoading(true); else setLoadingMore(true)
    setError('')
    try {
      const base = getApiBaseUrl()
      const data = await apiFetch(
        `${base}/api/v1/gym-owner/locations/${locId}/reviews?page=${page}`,
        token
      )
      setReviews((prev) => append ? [...prev, ...(data.data ?? [])] : (data.data ?? []))
      setMeta(data.meta ?? null)
    } catch {
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    if (!isActive || selectedLocId === null) return
    if (loadedLocRef.current === selectedLocId) return
    loadedLocRef.current = selectedLocId
    loadReviews(selectedLocId, 1, false)
  }, [isActive, selectedLocId, loadReviews])

  const handleRespond = async (reviewId: number) => {
    const token = getAuthToken()
    if (!token) return
    const text = responseTexts[reviewId] ?? ''
    if (!text.trim()) return
    setResponding((prev) => ({ ...prev, [reviewId]: 'saving' }))
    try {
      const base = getApiBaseUrl()
      await apiFetch(`${base}/api/v1/gym-owner/reviews/${reviewId}/respond`, token, {
        method: 'POST',
        body: JSON.stringify({ response: text }),
      })
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, owner_response: text } : r))
      )
      setResponseTexts((prev) => ({ ...prev, [reviewId]: '' }))
      setResponding((prev) => ({ ...prev, [reviewId]: 'done' }))
    } catch {
      setResponding((prev) => ({ ...prev, [reviewId]: 'error' }))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Member Reviews</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <LocationSelector
            locations={locations}
            selectedId={selectedLocId}
            onChange={(id) => {
              setSelectedLocId(id)
              loadedLocRef.current = null
            }}
          />
          {loading ? (
            <div className="text-center text-gray-500 py-4">Loading…</div>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No reviews yet for this location.</p>
          ) : (
            <>
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{review.reviewer}</p>
                      <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{review.text}</p>
                  {review.owner_response ? (
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Your response</p>
                      <p className="text-sm text-gray-700">{review.owner_response}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                        rows={3}
                        placeholder="Write a response…"
                        value={responseTexts[review.id] ?? ''}
                        onChange={(e) =>
                          setResponseTexts((prev) => ({ ...prev, [review.id]: e.target.value }))
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => handleRespond(review.id)}
                        disabled={responding[review.id] === 'saving'}
                        className="bg-[#16a34a] hover:bg-[#15803a] text-white"
                      >
                        {responding[review.id] === 'saving' ? 'Sending…' : 'Respond'}
                      </Button>
                      {responding[review.id] === 'error' && (
                        <p className="text-red-500 text-xs">Failed to send response.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {meta && meta.current_page < meta.last_page && (
                <div className="text-center pt-2">
                  <Button
                    variant="outline"
                    onClick={() => loadReviews(selectedLocId!, meta.current_page + 1, true)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading…' : `Load more (${meta.current_page} of ${meta.last_page} pages)`}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Team Tab ─────────────────────────────────────────────────────────────────

function TeamTab({ isActive, isOwner }: { isActive: boolean; isOwner: boolean }) {
  const loadedRef = useRef(false)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState<'manager' | 'staff' | 'trainer'>('manager')
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadMembers = useCallback(async () => {
    const token = getAuthToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await apiListTeamMembers(token)
      setMembers(res.members ?? [])
    } catch {
      setError('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isActive || loadedRef.current) return
    loadedRef.current = true
    loadMembers()
  }, [isActive, loadMembers])

  const handleInvite = async () => {
    const token = getAuthToken()
    if (!token || !inviteEmail) return
    setInviting(true)
    setError('')
    setSuccess('')
    try {
      await apiInviteTeamMember(token, inviteEmail, inviteName, inviteRole)
      setInviteEmail('')
      setInviteName('')
      setSuccess('Invitation sent!')
      loadedRef.current = false
      loadMembers()
    } catch {
      setError('Failed to send invitation')
    } finally {
      setInviting(false)
    }
  }

  const handleRevoke = async (memberId: number) => {
    const token = getAuthToken()
    if (!token) return
    try {
      await apiRevokeTeamMember(token, memberId)
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
    } catch {
      setError('Failed to revoke access')
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading…</div>

  return (
    <div className="space-y-6">
      {isOwner && (
        <Card>
          <CardHeader><CardTitle>Invite Team Member</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Name</Label>
                <Input
                  className="mt-1"
                  placeholder="Full name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Role</Label>
              <select
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "manager" | "staff" | "trainer")}
              >
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="trainer">Trainer</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <Button
              onClick={handleInvite}
              disabled={inviting || !inviteEmail}
              className="bg-[#16a34a] hover:bg-[#15803a] text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              {inviting ? 'Sending…' : 'Send Invitation'}
            </Button>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {members.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No team members yet.</p>
          ) : (
            members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {member.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">{member.role}</Badge>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleRevoke(member.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('gym-info')
  const [locations, setLocations] = useState<ApiLocation[]>([])
  const [gymName, setGymName] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [bootstrapping, setBootstrapping] = useState(true)
  const [bootError, setBootError] = useState('')

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push('/login')
      return
    }
    const base = getApiBaseUrl()
    Promise.all([
      apiFetch(`${base}/api/v1/gym-owner/locations`, token),
      apiGetMe(token),
    ])
      .then(([locData, meData]) => {
        setGymName(locData.gym_name ?? '')
        setLocations(locData.locations ?? [])
        setIsOwner(meData.is_owner ?? true)
      })
      .catch(() => setBootError('Failed to load gym data'))
      .finally(() => setBootstrapping(false))
  }, [router])

  if (bootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your profile…</p>
      </div>
    )
  }

  if (bootError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{bootError}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{gymName || 'Gym Profile'}</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your gym information, pricing, hours, and more.</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap gap-1 h-auto">
            <TabsTrigger value="gym-info">Gym Info</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="gym-info">
            <GymInfoTab isActive={activeTab === 'gym-info'} isOwner={isOwner} />
          </TabsContent>

          <TabsContent value="amenities">
            <AmenitiesTab isActive={activeTab === 'amenities'} />
          </TabsContent>

          <TabsContent value="pricing">
            <PricingTab isActive={activeTab === 'pricing'} locations={locations} />
          </TabsContent>

          <TabsContent value="hours">
            <HoursTab isActive={activeTab === 'hours'} locations={locations} />
          </TabsContent>

          <TabsContent value="photos">
            <PhotosTab isActive={activeTab === 'photos'} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab isActive={activeTab === 'reviews'} locations={locations} />
          </TabsContent>

          <TabsContent value="team">
            <TeamTab isActive={activeTab === 'team'} isOwner={isOwner} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
