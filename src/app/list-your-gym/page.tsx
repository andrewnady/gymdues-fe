'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, apiGetMe } from '@/lib/gym-owner-auth'
import { getApiBaseUrl } from '@/lib/api-config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Upload, X } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

interface MembershipPlan {
  name: string
  pricePerMonth: string
  contractLength: string
  enrollmentFee: string
  annualFee: string
}

interface DayHours {
  open: string
  close: string
  closed: boolean
  is24: boolean
}

interface FormData {
  // Step 2 — Basic info
  gymName: string
  gymTypes: string[]
  address: string
  city: string
  state: string
  zip: string
  phone: string
  website: string
  yearFounded: string
  description: string
  // Step 3 — Pricing
  membershipPlans: MembershipPlan[]
  pricingVaries: boolean
  // Step 4 — Amenities
  amenities: string[]
  // Step 5 — Hours
  hours: Record<string, DayHours>
  sameHours: boolean
  // Step 6 — Photos
  coverPhoto: File | null
  galleryPhotos: File[]
  logo: File | null
  // Step 7 — Verification
  ownerName: string
  ownerRole: string
  ownerEmail: string
  ownerPhone: string
  verificationMethod: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = 8

const STEP_LABELS: Record<Step, string> = {
  1: 'Search',
  2: 'Gym Info',
  3: 'Pricing',
  4: 'Amenities',
  5: 'Hours',
  6: 'Photos',
  7: 'Verify',
  8: 'Review',
}

const GYM_TYPES = [
  'Traditional gym',
  'CrossFit box',
  'Yoga/Pilates studio',
  'Martial arts',
  'Boutique fitness',
  'Swimming',
  'Rock climbing',
  'Personal training studio',
  'Other',
]

const CONTRACT_OPTIONS = [
  { value: 'month-to-month', label: 'Month-to-month' },
  { value: '6months', label: '6 months' },
  { value: '12months', label: '12 months' },
  { value: '24months', label: '24 months' },
]

const AMENITIES_CONFIG: Record<string, string[]> = {
  Equipment: [
    'Free weights',
    'Cardio machines',
    'Cable machines',
    'Functional training',
    'Olympic lifting platforms',
    'Turf area',
    'Resistance machines',
    'Battle ropes'
  ],
  Classes: [
    'Group fitness', 
    'HIIT', 
    'Yoga', 
    'Spin/Cycling', 
    'Pilates', 
    'Boxing', 
    'Personal training',
    'Zumba',
    'CrossFit',
    'Streching'
  ],
  Facilities: [
    'Locker rooms',
    'Showers',
    'Sauna',
    'Steam room',
    'Pool',
    'Basketball court',
    'Childcare',
    'Cafe/Juice bar',
    'Wheelchair accessible'
  ],
  Access: [
    '24/7 access', 
    'Keycard entry', 
    'Guest passes', 
    'Multi-location access',
    'App-based entry',
    'Parking',
    'Bike Storage'
  ],
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const OWNER_ROLES = ['Owner', 'Manager', 'Marketing', 'Other']

const EMPTY_PLAN: MembershipPlan = {
  name: '',
  pricePerMonth: '',
  contractLength: 'month-to-month',
  enrollmentFee: '',
  annualFee: '',
}

function buildDefaultHours(): Record<string, DayHours> {
  return Object.fromEntries(DAYS.map((d) => [d, { open: '06:00', close: '22:00', closed: false, is24: false }]))
}

const EMPTY_FORM: FormData = {
  gymName: '',
  gymTypes: [],
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  website: '',
  yearFounded: '',
  description: '',
  membershipPlans: [{ ...EMPTY_PLAN }],
  pricingVaries: false,
  amenities: [],
  hours: buildDefaultHours(),
  sameHours: false,
  coverPhoto: null,
  galleryPhotos: [],
  logo: null,
  ownerName: '',
  ownerRole: '',
  ownerEmail: '',
  ownerPhone: '',
  verificationMethod: '',
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepSidebar({ step }: { step: Step }) {
  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => (i + 1) as Step)

  return (
    <nav className='flex flex-col gap-1'>
      {steps.map((s, idx) => (
        <div key={s} className='flex items-start gap-3'>
          {/* Dot + connector */}
          <div className='flex flex-col items-center'>
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                s < step
                  ? 'bg-primary text-primary-foreground'
                  : s === step
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            {idx < TOTAL_STEPS - 1 && (
              <div className={`w-[2px] h-6 mt-1 rounded-full transition-colors ${s < step ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>

          {/* Label */}
          <span
            className={`pt-1 text-sm leading-tight transition-colors ${
              s === step
                ? 'text-primary font-semibold'
                : s < step
                  ? 'text-primary/60 font-medium'
                  : 'text-muted-foreground'
            }`}
          >
            {STEP_LABELS[s]}
          </span>
        </div>
      ))}
    </nav>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className='space-y-1.5'>
      <Label>{label}</Label>
      {children}
      {error && <p className='text-red-500 text-xs'>{error}</p>}
    </div>
  )
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className='border rounded-lg p-4 space-y-1.5 mb-3'>
      <div className='flex items-center justify-between mb-1'>
        <h3 className='font-medium text-sm'>{title}</h3>
        <button type='button' onClick={onEdit} className='text-xs text-primary hover:underline'>
          Edit
        </button>
      </div>
      {children}
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex gap-2 text-sm'>
      <span className='text-muted-foreground w-28 shrink-0'>{label}</span>
      <span className='break-all'>{value || '—'}</span>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ListYourGymPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [step, setStep] = useState<Step>(1)
  const [fromReview, setFromReview] = useState(false)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Step 1 — search state
  const [searchName, setSearchName] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [searchState, setSearchState] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [matchedGym, setMatchedGym] = useState<{
    id: number
    name: string
    city: string
    slug?: string
  } | null>(null)

  // Submit state
  const [submitted, setSubmitted] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Photo refs
  const coverRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef<HTMLInputElement>(null)

  // ── Auth guard ────────────────────────────────────────────────────────────

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.replace('/gyms')
      return
    }
    apiGetMe(token).then((res) => {
      if (!res.success) {
        router.replace('/gyms')
      } else {
        setAuthChecked(true)
      }
    })
  }, [router])

  // ── Helpers ───────────────────────────────────────────────────────────────

  function setField(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      setErrors((er) => ({ ...er, [field]: '' }))
    }
  }

  function toggleGymType(type: string) {
    setForm((f) => ({
      ...f,
      gymTypes: f.gymTypes.includes(type) ? f.gymTypes.filter((t) => t !== type) : [...f.gymTypes, type],
    }))
    setErrors((er) => ({ ...er, gymTypes: '' }))
  }

  function toggleAmenity(item: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(item) ? f.amenities.filter((a) => a !== item) : [...f.amenities, item],
    }))
  }

  function addPlan() {
    if (form.membershipPlans.length >= 5) return
    setForm((f) => ({ ...f, membershipPlans: [...f.membershipPlans, { ...EMPTY_PLAN }] }))
  }

  function removePlan(idx: number) {
    setForm((f) => ({ ...f, membershipPlans: f.membershipPlans.filter((_, i) => i !== idx) }))
  }

  function setPlanField(idx: number, field: keyof MembershipPlan, value: string) {
    setForm((f) => {
      const plans = [...f.membershipPlans]
      plans[idx] = { ...plans[idx], [field]: value }
      return { ...f, membershipPlans: plans }
    })
  }

  function setDayField(day: string, field: keyof DayHours, value: string | boolean) {
    setForm((f) => ({
      ...f,
      hours: { ...f.hours, [day]: { ...f.hours[day], [field]: value } },
    }))
  }

  function applySameHours() {
    const template = form.hours['Monday']
    setForm((f) => ({
      ...f,
      sameHours: true,
      hours: Object.fromEntries(DAYS.map((d) => [d, { ...template }])),
    }))
  }

  // ── Validation ────────────────────────────────────────────────────────────

  function validateStep2() {
    const e: Record<string, string> = {}
    if (!form.gymName.trim()) e.gymName = 'Gym name is required.'
    if (form.gymTypes.length === 0) e.gymTypes = 'Select at least one gym type.'
    if (!form.address.trim()) e.address = 'Street address is required.'
    if (!form.city.trim()) e.city = 'City is required.'
    if (!form.state.trim()) e.state = 'State is required.'
    if (!form.zip.trim()) e.zip = 'ZIP code is required.'
    if (!form.phone.trim()) e.phone = 'Phone number is required.'
    return e
  }

  function validateStep3() {
    const e: Record<string, string> = {}
    if (!form.pricingVaries) {
      form.membershipPlans.forEach((plan, i) => {
        if (!plan.name.trim()) e[`plan_${i}_name`] = 'Plan name is required.'
        if (!plan.pricePerMonth.trim()) e[`plan_${i}_price`] = 'Price is required.'
      })
    }
    return e
  }

  function validateStep6() {
    const e: Record<string, string> = {}
    if (!form.coverPhoto) e.coverPhoto = 'A cover photo is required.'
    return e
  }

  function validateStep7() {
    const e: Record<string, string> = {}
    if (!form.ownerName.trim()) e.ownerName = 'Full name is required.'
    if (!form.ownerRole) e.ownerRole = 'Please select your role.'
    if (!form.ownerEmail.trim()) e.ownerEmail = 'Business email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)) e.ownerEmail = 'Please enter a valid email.'
    if (!form.ownerPhone.trim()) e.ownerPhone = 'Phone number is required.'
    if (!form.verificationMethod) e.verificationMethod = 'Please select a verification method.'
    return e
  }

  function handleNext() {
    let e: Record<string, string> = {}
    if (step === 2) e = validateStep2()
    if (step === 3) e = validateStep3()
    if (step === 6) e = validateStep6()
    if (step === 7) e = validateStep7()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    setErrors({})
    if (fromReview) {
      setFromReview(false)
      setStep(8)
      return
    }
    setStep((s) => (s + 1) as Step)
  }

  function handleBack() {
    setErrors({})
    if (fromReview) {
      setFromReview(false)
      setStep(8)
      return
    }
    setStep((s) => (s - 1) as Step)
  }

  function goEditStep(target: Step) {
    setFromReview(true)
    setErrors({})
    setStep(target)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitLoading(true)
    setSubmitError('')
    try {
      // TODO: POST full form data to listing API
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  // ── Step 1 search ─────────────────────────────────────────────────────────

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearchError('')
    setMatchedGym(null)
    if (!searchName.trim()) {
      setSearchError('Gym name is required.')
      return
    }
    if (!searchCity.trim()) {
      setSearchError('City is required.')
      return
    }
    setSearchLoading(true)
    try {
      const params = new URLSearchParams({ name: searchName.trim(), city: searchCity.trim() })
      if (searchState.trim()) params.append('state', searchState.trim())
      const res = await fetch(`${getApiBaseUrl()}/api/v1/gyms/search?${params}`, {
        headers: { Accept: 'application/json' },
      })
      const data = await res.json()
      if (data.gym) {
        setMatchedGym(data.gym)
      } else {
        // No duplicate — prefill step 2 and proceed
        setForm((f) => ({
          ...f,
          gymName: searchName.trim(),
          city: searchCity.trim(),
          state: searchState.trim(),
        }))
        setStep(2)
      }
    } catch {
      // On network error, allow proceed
      setForm((f) => ({
        ...f,
        gymName: searchName.trim(),
        city: searchCity.trim(),
        state: searchState.trim(),
      }))
      setStep(2)
    } finally {
      setSearchLoading(false)
    }
  }

  // ── Guards ────────────────────────────────────────────────────────────────

  if (!authChecked) {
    return (
      <div className='min-h-[calc(100vh-200px)] flex items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className='min-h-[calc(100vh-200px)] flex items-center justify-center px-4'>
        <div className='text-center max-w-md'>
          <div className='text-green-600 text-6xl mb-4'>✓</div>
          <h1 className='text-2xl font-bold mb-2'>Listing submitted!</h1>
          <p className='text-muted-foreground mb-2'>
            Thanks for submitting <strong>{form.gymName}</strong>.
          </p>
          <p className='text-muted-foreground mb-6'>
            {form.verificationMethod === 'document'
              ? 'Our team will review your document and listing within 24–48 hours.'
              : 'Your listing will go live once verified — usually within minutes.'}
          </p>
          <Button onClick={() => router.push('/gyms')}>Browse gyms</Button>
        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100)

  return (
    <div className='flex flex-col md:flex-row min-h-[calc(100vh-200px)]'>
      {/* ── Left sidebar ── */}
      <aside className='md:w-70 shrink-0 border-b md:border-b-0 md:border-r px-4 py-6 md:px-6 md:py-12'>
        <h1 className='text-xl font-bold mb-1'>List your gym</h1>
        <p className='text-muted-foreground text-xs mb-4 hidden md:block'>
          Fill in your gym&apos;s details and we&apos;ll get it live on GymDues.
        </p>

        {/* Progress bar */}
        <div className='mb-4 md:mb-8'>
          <div className='flex justify-between text-[10px] text-muted-foreground mb-1.5'>
            <span className='uppercase tracking-wide font-medium'>Progress</span>
            <span>{pct}% complete</span>
          </div>
          <div className='h-1.5 w-full rounded-full bg-muted overflow-hidden'>
            <div
              className='h-full rounded-full bg-primary transition-all duration-500 ease-in-out'
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Mobile: current step label */}
        <p className='md:hidden text-sm font-medium text-primary'>
          Step {step} of {TOTAL_STEPS} &mdash; {STEP_LABELS[step]}
        </p>

        {/* Desktop: full vertical step list */}
        <div className='hidden md:block'>
          <StepSidebar step={step} />
        </div>
      </aside>

      {/* ── Right form area ── */}
      <div className='flex-1 px-4 py-6 md:px-10 md:py-12 max-w-4xl'>

        {/* ── Step 1: Gym Search / Duplicate Check ── */}
        {step === 1 && (
          <form onSubmit={handleSearch} className='space-y-5'>
            <div>
              <h2 className='text-2xl font-semibold'>Search for your gym</h2>
              <p className='text-sm text-muted-foreground mt-1'>
                Let&apos;s first check if your gym is already listed. If it is, you can claim it instead.
              </p>
            </div>

            {matchedGym && (
              <div className='border border-yellow-300 bg-yellow-50 rounded-lg p-4'>
                <p className='font-semibold text-yellow-900 mb-1'>We found a matching gym</p>
                <p className='text-sm text-yellow-800 mb-3'>
                  <strong>{matchedGym.name}</strong> in {matchedGym.city} is already listed on GymDues. Would
                  you like to claim it instead?
                </p>
                <div className='flex gap-2 flex-wrap'>
                  <Button
                    type='button'
                    size='sm'
                    onClick={() => router.push(`/gyms/${matchedGym.slug ?? matchedGym.id}?claim=1`)}
                  >
                    Claim this gym
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    onClick={() => {
                      setMatchedGym(null)
                      setForm((f) => ({
                        ...f,
                        gymName: searchName.trim(),
                        city: searchCity.trim(),
                        state: searchState.trim(),
                      }))
                      setStep(2)
                    }}
                  >
                    This is a different gym
                  </Button>
                </div>
              </div>
            )}

            <Field label='Gym name' error={searchError || undefined}>
              <Input
                placeholder='e.g. Iron Gym Downtown'
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value)
                  setSearchError('')
                  setMatchedGym(null)
                }}
              />
            </Field>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Field label='City'>
                <Input
                  placeholder='Chicago'
                  value={searchCity}
                  onChange={(e) => {
                    setSearchCity(e.target.value)
                    setMatchedGym(null)
                  }}
                />
              </Field>
              <Field label='State'>
                <Input
                  placeholder='IL'
                  value={searchState}
                  onChange={(e) => setSearchState(e.target.value)}
                />
              </Field>
            </div>

            <div className='flex justify-end pt-2'>
              <Button type='submit' disabled={searchLoading}>
                {searchLoading ? 'Searching…' : 'Search gym'}
              </Button>
            </div>
          </form>
        )}

        {/* ── Steps 2–8 ── */}
        {step > 1 && (
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* ── Step 2: Basic Gym Info ── */}
            {step === 2 && (
              <>
                <h2 className='text-2xl font-semibold'>Basic gym info</h2>

                <Field label='Gym name *' error={errors.gymName}>
                  <Input
                    placeholder='e.g. Iron Gym Downtown'
                    value={form.gymName}
                    onChange={setField('gymName')}
                  />
                </Field>

                <div className='space-y-1.5'>
                  <Label>
                    Gym type *{' '}
                    {errors.gymTypes && (
                      <span className='text-red-500 text-xs font-normal ml-1'>{errors.gymTypes}</span>
                    )}
                  </Label>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
                    {GYM_TYPES.map((type) => (
                      <label
                        key={type}
                        className={`flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer text-sm transition-colors ${
                          form.gymTypes.includes(type)
                            ? 'border-primary bg-primary/5'
                            : 'border-input hover:border-primary/50'
                        }`}
                      >
                        <input
                          type='checkbox'
                          className='accent-primary shrink-0'
                          checked={form.gymTypes.includes(type)}
                          onChange={() => toggleGymType(type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <Field label='Street address *' error={errors.address}>
                  <Input placeholder='123 Main St' value={form.address} onChange={setField('address')} />
                </Field>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <Field label='City *' error={errors.city}>
                    <Input placeholder='Chicago' value={form.city} onChange={setField('city')} />
                  </Field>
                  <Field label='State *' error={errors.state}>
                    <Input placeholder='IL' value={form.state} onChange={setField('state')} />
                  </Field>
                </div>

                <Field label='ZIP code *' error={errors.zip}>
                  <Input placeholder='60601' value={form.zip} onChange={setField('zip')} />
                </Field>

                <Field label='Phone number *' error={errors.phone}>
                  <Input type='tel' placeholder='(312) 555-0100' value={form.phone} onChange={setField('phone')} />
                </Field>

                <Field label='Business website'>
                  <Input
                    type='url'
                    placeholder='https://yourgym.com'
                    value={form.website}
                    onChange={setField('website')}
                  />
                </Field>

                <Field label='Year founded'>
                  <Input
                    type='number'
                    placeholder='2005'
                    min='1800'
                    max={new Date().getFullYear()}
                    value={form.yearFounded}
                    onChange={setField('yearFounded')}
                  />
                </Field>

                <div className='space-y-1.5'>
                  <Label>Short description</Label>
                  <textarea
                    className='flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    placeholder='What makes your gym special…'
                    value={form.description}
                    onChange={setField('description')}
                  />
                </div>
              </>
            )}

            {/* ── Step 3: Membership Pricing ── */}
            {step === 3 && (
              <>
                <h2 className='text-2xl font-semibold'>Membership pricing</h2>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    className='accent-primary'
                    checked={form.pricingVaries}
                    onChange={(e) => setForm((f) => ({ ...f, pricingVaries: e.target.checked }))}
                  />
                  <span className='text-sm'>Pricing varies by location / contact for pricing</span>
                </label>

                {!form.pricingVaries && (
                  <>
                    {form.membershipPlans.map((plan, idx) => (
                      <div key={idx} className='border rounded-lg p-4 space-y-4'>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium text-sm'>Plan {idx + 1}</span>
                          {form.membershipPlans.length > 1 && (
                            <button
                              type='button'
                              onClick={() => removePlan(idx)}
                              className='text-muted-foreground hover:text-red-500 transition-colors'
                              aria-label='Remove plan'
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        <Field label='Plan name' error={errors[`plan_${idx}_name`]}>
                          <Input
                            placeholder='e.g. Basic, Premium, Student'
                            value={plan.name}
                            onChange={(e) => setPlanField(idx, 'name', e.target.value)}
                          />
                        </Field>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          <Field label='Price per month ($)' error={errors[`plan_${idx}_price`]}>
                            <Input
                              type='number'
                              placeholder='49'
                              min='0'
                              value={plan.pricePerMonth}
                              onChange={(e) => setPlanField(idx, 'pricePerMonth', e.target.value)}
                            />
                          </Field>
                          <div className='space-y-1.5'>
                            <Label>Contract required</Label>
                            <select
                              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
                              value={plan.contractLength}
                              onChange={(e) => setPlanField(idx, 'contractLength', e.target.value)}
                            >
                              {CONTRACT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          <Field label='Enrollment fee ($)'>
                            <Input
                              type='number'
                              placeholder='0'
                              min='0'
                              value={plan.enrollmentFee}
                              onChange={(e) => setPlanField(idx, 'enrollmentFee', e.target.value)}
                            />
                          </Field>
                          <Field label='Annual fee ($)'>
                            <Input
                              type='number'
                              placeholder='0'
                              min='0'
                              value={plan.annualFee}
                              onChange={(e) => setPlanField(idx, 'annualFee', e.target.value)}
                            />
                          </Field>
                        </div>
                      </div>
                    ))}

                    {form.membershipPlans.length < 5 && (
                      <button
                        type='button'
                        onClick={addPlan}
                        className='flex items-center gap-1.5 text-sm text-primary hover:underline'
                      >
                        <Plus size={16} />
                        Add another plan
                      </button>
                    )}
                  </>
                )}
              </>
            )}

            {/* ── Step 4: Amenities & Features ── */}
            {step === 4 && (
              <>
                <h2 className='text-2xl font-semibold'>Amenities &amp; features</h2>
                <p className='text-sm text-muted-foreground'>Select everything that applies to your gym.</p>

                {Object.entries(AMENITIES_CONFIG).map(([category, items]) => (
                  <div key={category} className='space-y-2'>
                    <p className='text-sm font-medium'>{category}</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                      {items.map((item) => (
                        <label
                          key={item}
                          className={`flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer text-sm transition-colors ${
                            form.amenities.includes(item)
                              ? 'border-primary bg-primary/5'
                              : 'border-input hover:border-primary/50'
                          }`}
                        >
                          <input
                            type='checkbox'
                            className='accent-primary shrink-0'
                            checked={form.amenities.includes(item)}
                            onChange={() => toggleAmenity(item)}
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── Step 5: Operating Hours ── */}
            {step === 5 && (
              <>
                <h2 className='text-2xl font-semibold'>Operating hours</h2>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    className='accent-primary'
                    checked={form.sameHours}
                    onChange={(e) => {
                      if (e.target.checked) {
                        applySameHours()
                      } else {
                        setForm((f) => ({ ...f, sameHours: false }))
                      }
                    }}
                  />
                  <span className='text-sm'>Same hours every day</span>
                </label>

                <div className='space-y-2'>
                  {(form.sameHours ? ['Monday'] : DAYS).map((day) => {
                    const dh = form.hours[day]
                    return (
                      <div
                        key={day}
                        className='flex flex-wrap items-center gap-2 text-sm border rounded-md px-3 py-2'
                      >
                        <span className='w-24 font-medium shrink-0'>
                          {form.sameHours ? 'All days' : day}
                        </span>

                        {dh.closed ? (
                          <span className='text-muted-foreground flex-1'>Closed</span>
                        ) : dh.is24 ? (
                          <span className='text-muted-foreground flex-1'>24 hours</span>
                        ) : (
                          <div className='flex items-center gap-1 flex-1'>
                            <input
                              type='time'
                              className='border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
                              value={dh.open}
                              onChange={(e) => setDayField(day, 'open', e.target.value)}
                            />
                            <span className='text-muted-foreground'>–</span>
                            <input
                              type='time'
                              className='border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
                              value={dh.close}
                              onChange={(e) => setDayField(day, 'close', e.target.value)}
                            />
                          </div>
                        )}

                        <div className='flex items-center gap-3 ml-auto shrink-0'>
                          <label className='flex items-center gap-1 text-xs text-muted-foreground cursor-pointer'>
                            <input
                              type='checkbox'
                              className='accent-primary'
                              checked={dh.is24}
                              disabled={dh.closed}
                              onChange={(e) => setDayField(day, 'is24', e.target.checked)}
                            />
                            24hr
                          </label>
                          <label className='flex items-center gap-1 text-xs text-muted-foreground cursor-pointer'>
                            <input
                              type='checkbox'
                              className='accent-primary'
                              checked={dh.closed}
                              onChange={(e) => setDayField(day, 'closed', e.target.checked)}
                            />
                            Closed
                          </label>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* ── Step 6: Photos & Media ── */}
            {step === 6 && (
              <>
                <h2 className='text-2xl font-semibold'>Photos &amp; media</h2>
                <p className='text-sm bg-blue-50 border border-blue-200 text-blue-800 rounded-md px-3 py-2'>
                  Photos help members decide — listings with photos get 4× more clicks
                </p>

                {/* Cover photo */}
                <div className='space-y-1.5'>
                  <Label>Cover photo *</Label>
                  {form.coverPhoto ? (
                    <div className='relative w-full h-44 rounded-lg overflow-hidden border'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(form.coverPhoto)}
                        alt='Cover preview'
                        className='w-full h-full object-cover'
                      />
                      <button
                        type='button'
                        onClick={() => setForm((f) => ({ ...f, coverPhoto: null }))}
                        className='absolute top-2 right-2 bg-white/90 rounded-full p-1 hover:bg-white shadow'
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/60 transition-colors ${
                        errors.coverPhoto ? 'border-red-400' : 'border-input'
                      }`}
                      onClick={() => coverRef.current?.click()}
                    >
                      <Upload size={24} className='mx-auto mb-2 text-muted-foreground' />
                      <p className='text-sm text-muted-foreground'>Click to upload cover photo</p>
                      <p className='text-xs text-muted-foreground mt-1'>JPG, PNG, WebP · max 10 MB</p>
                      <input
                        ref={coverRef}
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={(e) => {
                          setForm((f) => ({ ...f, coverPhoto: e.target.files?.[0] ?? null }))
                          setErrors((er) => ({ ...er, coverPhoto: '' }))
                        }}
                      />
                    </div>
                  )}
                  {errors.coverPhoto && <p className='text-red-500 text-xs'>{errors.coverPhoto}</p>}
                </div>

                {/* Gallery */}
                <div className='space-y-1.5'>
                  <Label>Gallery photos (up to 8, optional)</Label>
                  <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
                    {form.galleryPhotos.map((file, idx) => (
                      <div key={idx} className='relative aspect-square rounded-md overflow-hidden border'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Gallery ${idx + 1}`}
                          className='w-full h-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              galleryPhotos: f.galleryPhotos.filter((_, i) => i !== idx),
                            }))
                          }
                          className='absolute top-1 right-1 bg-white/90 rounded-full p-0.5 hover:bg-white shadow'
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {form.galleryPhotos.length < 8 && (
                      <div
                        className='aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 transition-colors text-muted-foreground'
                        onClick={() => galleryRef.current?.click()}
                      >
                        <Plus size={20} />
                        <span className='text-xs mt-1'>Add</span>
                        <input
                          ref={galleryRef}
                          type='file'
                          accept='image/*'
                          multiple
                          className='hidden'
                          onChange={(e) => {
                            const files = Array.from(e.target.files ?? [])
                            setForm((f) => ({
                              ...f,
                              galleryPhotos: [...f.galleryPhotos, ...files].slice(0, 8),
                            }))
                            // reset so same files can be re-selected
                            e.target.value = ''
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo */}
                <div className='space-y-1.5'>
                  <Label>Logo (optional)</Label>
                  {form.logo ? (
                    <div className='relative w-24 h-24 rounded-lg overflow-hidden border'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(form.logo)}
                        alt='Logo preview'
                        className='w-full h-full object-contain p-2'
                      />
                      <button
                        type='button'
                        onClick={() => setForm((f) => ({ ...f, logo: null }))}
                        className='absolute top-1 right-1 bg-white/90 rounded-full p-0.5 hover:bg-white shadow'
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className='w-36 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/60 transition-colors'
                      onClick={() => logoRef.current?.click()}
                    >
                      <Upload size={20} className='mx-auto mb-1 text-muted-foreground' />
                      <p className='text-xs text-muted-foreground'>Upload logo</p>
                      <input
                        ref={logoRef}
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={(e) => setForm((f) => ({ ...f, logo: e.target.files?.[0] ?? null }))}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── Step 7: Owner Verification ── */}
            {step === 7 && (
              <>
                <h2 className='text-2xl font-semibold'>Owner verification</h2>
                <p className='text-sm text-muted-foreground'>
                  Confirm you have the authority to list this gym on GymDues.
                </p>

                <Field label='Full name *' error={errors.ownerName}>
                  <Input
                    placeholder='Jane Smith'
                    value={form.ownerName}
                    onChange={setField('ownerName')}
                  />
                </Field>

                <div className='space-y-1.5'>
                  <Label>Role *</Label>
                  <select
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.ownerRole ? 'border-red-400' : 'border-input'
                    }`}
                    value={form.ownerRole}
                    onChange={setField('ownerRole')}
                  >
                    <option value=''>Select your role…</option>
                    {OWNER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {errors.ownerRole && <p className='text-red-500 text-xs'>{errors.ownerRole}</p>}
                </div>

                <Field label='Business email *' error={errors.ownerEmail}>
                  <Input
                    type='email'
                    placeholder='you@yourgym.com'
                    value={form.ownerEmail}
                    onChange={setField('ownerEmail')}
                  />
                </Field>

                <Field label='Phone number *' error={errors.ownerPhone}>
                  <Input
                    type='tel'
                    placeholder='(312) 555-0100'
                    value={form.ownerPhone}
                    onChange={setField('ownerPhone')}
                  />
                </Field>

                <div className='space-y-2'>
                  <Label>Preferred verification method *</Label>
                  {errors.verificationMethod && (
                    <p className='text-red-500 text-xs'>{errors.verificationMethod}</p>
                  )}
                  {[
                    {
                      value: 'email',
                      label: 'Email domain match',
                      desc: 'Verify via your business email domain',
                    },
                    {
                      value: 'phone',
                      label: 'SMS to listed number',
                      desc: "Verify via a code sent to your gym's phone number",
                    },
                    {
                      value: 'document',
                      label: 'Document upload',
                      desc: 'Upload a business license or lease agreement',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                        form.verificationMethod === opt.value
                          ? 'border-primary bg-primary/5'
                          : 'border-input hover:border-primary/50'
                      }`}
                    >
                      <input
                        type='radio'
                        name='verificationMethod'
                        value={opt.value}
                        checked={form.verificationMethod === opt.value}
                        onChange={setField('verificationMethod')}
                        className='accent-primary mt-0.5'
                      />
                      <div>
                        <p className='text-sm font-medium'>{opt.label}</p>
                        <p className='text-xs text-muted-foreground'>{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* ── Step 8: Review & Submit ── */}
            {step === 8 && (
              <>
                <h2 className='text-2xl font-semibold'>Review &amp; submit</h2>
                <p className='text-sm text-muted-foreground mb-2'>
                  Review your listing below. Click Edit on any section to make changes.
                </p>

                <ReviewSection title='Gym info' onEdit={() => goEditStep(2)}>
                  <ReviewRow label='Name' value={form.gymName} />
                  <ReviewRow label='Type' value={form.gymTypes.join(', ')} />
                  <ReviewRow
                    label='Address'
                    value={`${form.address}, ${form.city}, ${form.state} ${form.zip}`}
                  />
                  <ReviewRow label='Phone' value={form.phone} />
                  {form.website && <ReviewRow label='Website' value={form.website} />}
                  {form.yearFounded && <ReviewRow label='Year founded' value={form.yearFounded} />}
                  {form.description && <ReviewRow label='Description' value={form.description} />}
                </ReviewSection>

                <ReviewSection title='Pricing' onEdit={() => goEditStep(3)}>
                  {form.pricingVaries ? (
                    <p className='text-sm text-muted-foreground'>Pricing varies / contact for pricing</p>
                  ) : (
                    form.membershipPlans.map((plan, i) => (
                      <div key={i} className='text-sm'>
                        <strong>{plan.name || `Plan ${i + 1}`}</strong>: ${plan.pricePerMonth}/mo ·{' '}
                        {CONTRACT_OPTIONS.find((o) => o.value === plan.contractLength)?.label}
                        {plan.enrollmentFee && ` · $${plan.enrollmentFee} enrollment`}
                        {plan.annualFee && ` · $${plan.annualFee}/yr`}
                      </div>
                    ))
                  )}
                </ReviewSection>

                <ReviewSection title='Amenities' onEdit={() => goEditStep(4)}>
                  <p className='text-sm'>
                    {form.amenities.length > 0 ? form.amenities.join(', ') : 'None selected'}
                  </p>
                </ReviewSection>

                <ReviewSection title='Hours' onEdit={() => goEditStep(5)}>
                  {form.sameHours ? (
                    <ReviewRow
                      label='All days'
                      value={
                        form.hours['Monday'].closed
                          ? 'Closed'
                          : form.hours['Monday'].is24
                            ? '24 hours'
                            : `${form.hours['Monday'].open} – ${form.hours['Monday'].close}`
                      }
                    />
                  ) : (
                    DAYS.map((day) => (
                      <ReviewRow
                        key={day}
                        label={day}
                        value={
                          form.hours[day].closed
                            ? 'Closed'
                            : form.hours[day].is24
                              ? '24 hours'
                              : `${form.hours[day].open} – ${form.hours[day].close}`
                        }
                      />
                    ))
                  )}
                </ReviewSection>

                <ReviewSection title='Photos' onEdit={() => goEditStep(6)}>
                  <ReviewRow label='Cover' value={form.coverPhoto ? form.coverPhoto.name : 'None'} />
                  <ReviewRow
                    label='Gallery'
                    value={form.galleryPhotos.length > 0 ? `${form.galleryPhotos.length} photo(s)` : 'None'}
                  />
                  <ReviewRow label='Logo' value={form.logo ? form.logo.name : 'None'} />
                </ReviewSection>

                <ReviewSection title='Verification' onEdit={() => goEditStep(7)}>
                  <ReviewRow label='Name' value={form.ownerName} />
                  <ReviewRow label='Role' value={form.ownerRole} />
                  <ReviewRow label='Email' value={form.ownerEmail} />
                  <ReviewRow label='Phone' value={form.ownerPhone} />
                  <ReviewRow label='Method' value={form.verificationMethod} />
                </ReviewSection>

                <div className='border rounded-lg p-4'>
                  <label className='flex items-start gap-2 cursor-pointer'>
                    <input type='checkbox' required className='accent-primary mt-0.5' />
                    <span className='text-sm'>
                      I agree to the{' '}
                      <a href='/terms' className='underline text-primary' target='_blank' rel='noreferrer'>
                        Terms of Service
                      </a>{' '}
                      and confirm I have the authority to list this gym on GymDues.
                    </span>
                  </label>
                </div>

                {submitError && <p className='text-red-500 text-sm'>{submitError}</p>}
              </>
            )}

            {/* ── Navigation ── */}
            <div className='flex justify-between pt-2'>
              <Button type='button' variant='outline' onClick={handleBack}>
                {fromReview ? 'Back to review' : 'Back'}
              </Button>
              {step < 8 ? (
                <Button type='button' onClick={handleNext}>
                  {fromReview ? 'Save & back to review' : 'Next'}
                </Button>
              ) : (
                <Button type='submit' disabled={submitLoading}>
                  {submitLoading ? 'Submitting…' : 'Submit listing'}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

