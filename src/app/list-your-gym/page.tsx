'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, apiGetMe } from '@/lib/gym-owner-auth'
import { getApiBaseUrl } from '@/lib/api-config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, FileText, Mail, Phone, Plus, Trash2, Upload, X } from 'lucide-react'

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
  verificationDoc: File | null
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

const GYM_TYPES: { value: string; label: string }[] = [
  { value: 'traditional_gym',           label: 'Traditional gym' },
  { value: 'crossfit_box',              label: 'CrossFit box' },
  { value: 'yoga_pilates_studio',       label: 'Yoga/Pilates studio' },
  { value: 'martial_arts',              label: 'Martial arts' },
  { value: 'boutique_fitness',          label: 'Boutique fitness' },
  { value: 'swimming',                  label: 'Swimming' },
  { value: 'rock_climbing',             label: 'Rock climbing' },
  { value: 'personal_training_studio',  label: 'Personal training studio' },
  { value: 'other',                     label: 'Other' },
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

// Maps frontend display labels → backend snake_case values accepted by Gym::AMENITIES.
// Labels not present here are frontend-only and will be omitted from the API payload.
const AMENITY_LABEL_TO_VALUE: Record<string, string> = {
  'Free weights':              'free_weights',
  'Cardio machines':           'cardio_machines',
  'Cable machines':            'cable_machines',
  'Functional training':       'functional_training',
  'Olympic lifting platforms': 'olympic_lifting_platforms',
  'Turf area':                 'turf_area',
  'Group fitness':             'group_fitness',
  'HIIT':                      'hiit',
  'Yoga':                      'yoga',
  'Spin/Cycling':              'spin',
  'Pilates':                   'pilates',
  'Boxing':                    'boxing',
  'Personal training':         'personal_training',
  'Locker rooms':              'locker_rooms',
  'Showers':                   'showers',
  'Sauna':                     'sauna',
  'Steam room':                'steam_room',
  'Pool':                      'pool',
  'Basketball court':          'basketball_court',
  'Parking':                   'parking',
  'Childcare':                 'childcare',
  '24/7 access':               '24_7_access',
  'Keycard entry':             'keycard_entry',
  'Guest passes':              'guest_passes',
  'Multi-location access':     'multi_location_access',
}

// Reverse map: backend snake_case amenity value → frontend display label
const AMENITY_VALUE_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(AMENITY_LABEL_TO_VALUE).map(([label, value]) => [value, label])
)

// Reverse map: backend contract_length value → frontend contractLength key
const API_CONTRACT_TO_FE: Record<string, string> = {
  'month_to_month': 'month-to-month',
  '6_months':       '6months',
  '12_months':      '12months',
  '24_months':      '24months',
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
  verificationDoc: null,
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
  const [matchedGyms, setMatchedGyms] = useState<{
    id: number
    name: string
    city: string
    state?: string
    slug?: string
  }[]>([])

  // Step API state
  const [gymId, setGymId] = useState<number | null>(null)
  const [claimId, setClaimId] = useState<number | null>(null)
  const [stepLoading, setStepLoading] = useState(false)
  const [stepError, setStepError] = useState('')

  // Submit state
  const [submitted, setSubmitted] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [listingStatus, setListingStatus] = useState<'live' | 'pending_review' | ''>('')

  // Step 7 two-phase verification state
  const [step7Phase, setStep7Phase] = useState<1 | 2>(1)
  const [step7AvailableMethods, setStep7AvailableMethods] = useState<string[]>([])
  const [step7SmsConsent, setStep7SmsConsent] = useState(false)
  const [step7SmsConsentError, setStep7SmsConsentError] = useState('')
  const [step7SelMethod, setStep7SelMethod] = useState<'email' | 'phone' | 'document' | ''>('')
  const [step7EmailCodeSent, setStep7EmailCodeSent] = useState(false)
  const [step7EmailCode, setStep7EmailCode] = useState('')
  const [step7PhoneCodeSent, setStep7PhoneCodeSent] = useState(false)
  const [step7PhoneCode, setStep7PhoneCode] = useState('')
  const [step7SelectedPhone, setStep7SelectedPhone] = useState('')
  const [step7DocType, setStep7DocType] = useState('')
  const [step7VerifError, setStep7VerifError] = useState('')
  const [step7SendingCode, setStep7SendingCode] = useState(false)
  const [step7VerifyLoading, setStep7VerifyLoading] = useState(false)
  const step7OtpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Previously-uploaded photo info (set when resuming a draft; File objects can't be restored from URLs)
  const [draftPhotoInfo, setDraftPhotoInfo] = useState<{
    coverPhoto?: string
    galleryCount?: number
    logo?: string
  }>({})

  // Photo refs
  const coverRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const docRef = useRef<HTMLInputElement>(null)

  // ── Auth guard ────────────────────────────────────────────────────────────

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.replace('/gyms')
      return
    }
    ;(async () => {
      const res = await apiGetMe(token)
      if (!res.success) {
        router.replace('/gyms')
        return
      }
      // Resume any in-progress draft session
      try {
        const draftRes = await fetch(`${getApiBaseUrl()}/api/v1/gym-listing/draft`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        })
        const draftData = await draftRes.json()
        if (draftData.success && draftData.draft) {
          setGymId(draftData.draft.gym_id)
          setStep(Math.min(draftData.draft.current_step + 1, 8) as Step)

          // Populate form with previously saved draft data so the review step is not empty
          try {
            const reviewRes = await fetch(`${getApiBaseUrl()}/api/v1/gym-listing/draft/review`, {
              headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            })
            if (reviewRes.ok) {
              const rd = await reviewRes.json()
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setForm((f) => ({
                ...f,
                // Step 2 — gym info
                gymName:     rd.gym?.name          ?? f.gymName,
                gymTypes:    Array.isArray(rd.gym?.gym_types) ? rd.gym.gym_types : f.gymTypes,
                address:     rd.address?.street    ?? f.address,
                city:        rd.address?.city      ?? f.city,
                state:       rd.address?.state     ?? f.state,
                zip:         rd.address?.zip       ?? f.zip,
                phone:       rd.contacts?.phone    ?? f.phone,
                website:     rd.contacts?.website  ?? f.website,
                yearFounded: rd.gym?.year_founded  != null ? String(rd.gym.year_founded) : f.yearFounded,
                description: rd.gym?.description   ?? f.description,
                // Step 3 — pricing
                pricingVaries:   rd.address?.pricing_on_request ?? f.pricingVaries,
                membershipPlans: Array.isArray(rd.plans) && rd.plans.length > 0
                  ? rd.plans.map((p: any) => ({
                      name:           String(p.tier_name ?? ''),
                      pricePerMonth:  p.price          != null ? String(p.price)          : '',
                      contractLength: API_CONTRACT_TO_FE[String(p.contract_length ?? '')] ?? String(p.contract_length ?? 'month-to-month'),
                      enrollmentFee:  p.enrollment_fee != null ? String(p.enrollment_fee) : '',
                      annualFee:      p.annual_fee     != null ? String(p.annual_fee)     : '',
                    }))
                  : f.membershipPlans,
                // Step 4 — amenities (backend stores snake_case values; map back to display labels)
                amenities: Array.isArray(rd.gym?.amenities)
                  ? rd.gym.amenities.map((v: string) => AMENITY_VALUE_TO_LABEL[v] ?? v).filter(Boolean)
                  : f.amenities,
                // Step 5 — hours (strip trailing seconds from "06:00:00" → "06:00")
                hours: rd.hours
                  ? Object.fromEntries(
                      Object.entries(rd.hours).map(([day, h]: [string, any]) => [
                        day,
                        {
                          open:   h.open  ? String(h.open).slice(0, 5)  : h.open,
                          close:  h.close ? String(h.close).slice(0, 5) : h.close,
                          closed: h.closed ?? false,
                          is24:   h.is24   ?? false,
                        },
                      ])
                    )
                  : f.hours,
                // Step 7 — verification
                ownerName:          rd.owner?.full_name      ?? f.ownerName,
                ownerRole:          rd.owner?.job_title
                  ? rd.owner.job_title.charAt(0).toUpperCase() + rd.owner.job_title.slice(1)
                  : f.ownerRole,
                ownerEmail:         rd.owner?.business_email ?? f.ownerEmail,
                ownerPhone:         rd.owner?.phone_number   ?? f.ownerPhone,
                verificationMethod: rd.verification_method   ?? f.verificationMethod,
              }))
              // Track uploaded photo info (File objects cannot be restored from server URLs)
              setDraftPhotoInfo({
                coverPhoto:   rd.photos?.cover_photo?.file_name ?? undefined,
                galleryCount: Array.isArray(rd.photos?.gallery) ? rd.photos.gallery.length : undefined,
                logo:         rd.photos?.logo?.file_name        ?? undefined,
              })
            }
          } catch {
            // ignore — review will show empty fields; user can navigate back to each step
          }
        }
      } catch {
        // ignore — proceed to step 1 as normal
      }
      setAuthChecked(true)
    })()
  }, [router])

  // ── Helpers ───────────────────────────────────────────────────────────────

  function setField(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      setErrors((er) => ({ ...er, [field]: '' }))
    }
  }

  function toggleGymType(value: string) {
    setForm((f) => ({
      ...f,
      gymTypes: f.gymTypes.includes(value) ? f.gymTypes.filter((t) => t !== value) : [...f.gymTypes, value],
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
    return e
  }

  async function extractApiError(res: Response, fallback: string): Promise<string> {
    try {
      const data = await res.json()
      // Laravel validation errors: { errors: { field: [msg, ...] } }
      if (data.errors && typeof data.errors === 'object') {
        const messages = (Object.values(data.errors) as string[][]).flat()
        if (messages.length) return messages[0]
      }
      return data.message ?? fallback
    } catch {
      return fallback
    }
  }

  function contractLengthToApi(fe: string): string {
    const map: Record<string, string> = {
      'month-to-month': 'month_to_month',
      '6months': '6_months',
      '12months': '12_months',
      '24months': '24_months',
    }
    return map[fe] ?? fe
  }

  async function handleNext() {
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
    setStepError('')

    const token = getAuthToken()

    if (step === 2) {
      setStepLoading(true)
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-listing/draft/step2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify({
            gym_name: form.gymName,
            gym_types: form.gymTypes,
            description: form.description || undefined,
            street: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            phone: form.phone,
            website: form.website || undefined,
            year_founded: form.yearFounded ? parseInt(form.yearFounded) : undefined,
          }),
        })
        if (!res.ok) {
          setStepError(await extractApiError(res, 'Failed to save gym info. Please try again.'))
          return
        }
        const data = await res.json()
        setGymId(data.gym_id)
      } catch {
        setStepError('Could not reach the server. Please check your connection and try again.')
        return
      } finally {
        setStepLoading(false)
      }
    }

    if (step === 3) {
      setStepLoading(true)
      try {
        const pricingOnRequest = form.pricingVaries
        const body: Record<string, unknown> = {
          gym_id: gymId,
          pricing_on_request: pricingOnRequest,
        }
        if (!pricingOnRequest) {
          body.plans = form.membershipPlans.map((plan) => ({
            plan_name: plan.name,
            price_per_month: parseFloat(plan.pricePerMonth),
            contract_length: contractLengthToApi(plan.contractLength),
            enrollment_fee: plan.enrollmentFee ? parseFloat(plan.enrollmentFee) : undefined,
            annual_fee: plan.annualFee ? parseFloat(plan.annualFee) : undefined,
          }))
        }
        const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-listing/draft/step3`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          setStepError(await extractApiError(res, 'Failed to save pricing. Please try again.'))
          return
        }
      } catch {
        setStepError('Could not reach the server. Please check your connection and try again.')
        return
      } finally {
        setStepLoading(false)
      }
    }

    if (step === 4) {
      setStepLoading(true)
      try {
        const amenityValues = form.amenities
          .map((label) => AMENITY_LABEL_TO_VALUE[label])
          .filter(Boolean)
        const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-listing/draft/step4`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify({
            gym_id: gymId,
            amenities: amenityValues,
          }),
        })
        if (!res.ok) {
          setStepError(await extractApiError(res, 'Failed to save amenities. Please try again.'))
          return
        }
      } catch {
        setStepError('Could not reach the server. Please check your connection and try again.')
        return
      } finally {
        setStepLoading(false)
      }
    }

    if (step === 5) {
      setStepLoading(true)
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-listing/draft/step5`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify({
            gym_id: gymId,
            hours: form.hours,
          }),
        })
        if (!res.ok) {
          setStepError(await extractApiError(res, 'Failed to save hours. Please try again.'))
          return
        }
      } catch {
        setStepError('Could not reach the server. Please check your connection and try again.')
        return
      } finally {
        setStepLoading(false)
      }
    }

    if (step === 6) {
      setStepLoading(true)
      try {
        const fd = new FormData()
        fd.append('gym_id', String(gymId))
        fd.append('cover_photo', form.coverPhoto as File)
        form.galleryPhotos.forEach((file) => fd.append('gallery_photos[]', file))
        if (form.logo) fd.append('logo', form.logo)

        const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-listing/draft/step6`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: fd,
        })
        if (!res.ok) {
          setStepError(await extractApiError(res, 'Failed to save photos. Please try again.'))
          return
        }
      } catch {
        setStepError('Could not reach the server. Please check your connection and try again.')
        return
      } finally {
        setStepLoading(false)
      }
    }

    if (step === 7) {
      // Phase 1: validate SMS consent then save owner details → get available methods
      if (!step7SmsConsent) {
        setStep7SmsConsentError('You must agree to receive messages to continue.')
        return
      }
      setStep7SmsConsentError('')
      setStepLoading(true)
      try {
        const step7Res = await fetch(`${getApiBaseUrl()}/api/v1/gym-listing/draft/step7`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify({
            gym_id: gymId,
            full_name: form.ownerName,
            job_title: form.ownerRole.toLowerCase(),
            business_email: form.ownerEmail,
            phone_number: form.ownerPhone,
          }),
        })
        if (!step7Res.ok) {
          setStepError(await extractApiError(step7Res, 'Failed to save verification info. Please try again.'))
          return
        }
        const step7Data = await step7Res.json()
        const newClaimId: number = step7Data.claim_id
        const methods: string[] = step7Data.available_methods ?? ['email_domain', 'phone_sms', 'document']
        setClaimId(newClaimId)
        setStep7AvailableMethods(methods)
        // Auto-select first available method
        const methodMap: Record<string, 'email' | 'phone' | 'document'> = {
          email_matched: 'email', email_domain: 'email',
          phone_matched: 'phone', phone_sms: 'phone',
          document: 'document',
        }
        const first = methods.map((m) => methodMap[m]).find(Boolean) ?? 'document'
        setStep7SelMethod(first)
        setForm((f) => ({ ...f, verificationMethod: first }))
        setStep7SelectedPhone(form.ownerPhone) // pre-select owner's phone for phone method
        setStep7Phase(2)
        return // stay on step 7, show phase 2
      } catch {
        setStepError('Could not reach the server. Please check your connection and try again.')
        return
      } finally {
        setStepLoading(false)
      }
    }

    if (fromReview) {
      setFromReview(false)
      setStep(8)
      return
    }
    setStep((s) => (s + 1) as Step)
  }

  async function handleStep7OtpVerify() {
    const code = step7SelMethod === 'email' ? step7EmailCode : step7PhoneCode
    if (code.trim().length < 6) {
      setStep7VerifError('Please enter the 6-digit verification code.')
      return
    }
    if (!claimId) return
    setStep7VerifyLoading(true)
    setStep7VerifError('')
    try {
      const endpoint = step7SelMethod === 'email'
        ? `${getApiBaseUrl()}/api/v1/gym-claims/${claimId}/verify-email`
        : `${getApiBaseUrl()}/api/v1/gym-claims/${claimId}/verify-phone`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setStep7VerifError(data.message ?? 'Invalid code. Please try again.')
        return
      }
      if (fromReview) setFromReview(false)
      setStep(8)
    } catch {
      setStep7VerifError('Could not reach the server. Please check your connection and try again.')
    } finally {
      setStep7VerifyLoading(false)
    }
  }

  async function handleStep7DocUpload() {
    if (!step7DocType) {
      setStep7VerifError('Please select a document type.')
      return
    }
    if (!form.verificationDoc) {
      setStep7VerifError('Please upload a document.')
      return
    }
    if (!claimId) return
    setStep7VerifyLoading(true)
    setStep7VerifError('')
    try {
      const fd = new FormData()
      fd.append('document', form.verificationDoc)
      const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-claims/${claimId}/upload-document`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setStep7VerifError(d.message ?? 'Failed to upload document. Please try again.')
        return
      }
      if (fromReview) setFromReview(false)
      setStep(8)
    } catch {
      setStep7VerifError('Could not reach the server. Please check your connection and try again.')
    } finally {
      setStep7VerifyLoading(false)
    }
  }

  function handleBack() {
    setErrors({})
    if (step === 7 && step7Phase === 2) {
      // If OTP was sent, go back to method selection; otherwise back to owner details
      if (step7EmailCodeSent || step7PhoneCodeSent) {
        setStep7EmailCodeSent(false)
        setStep7EmailCode('')
        setStep7PhoneCodeSent(false)
        setStep7PhoneCode('')
        setStep7VerifError('')
      } else {
        setStep7Phase(1)
      }
      return
    }
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
    if (target === 7) setStep7Phase(1)
    setStep(target)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitLoading(true)
    setSubmitError('')
    try {
      const token = getAuthToken()
      const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-listing/draft/step8`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({ gym_id: gymId }),
      })
      if (!res.ok) {
        setSubmitError(await extractApiError(res, 'Failed to submit listing. Please try again.'))
        return
      }
      const data = await res.json()
      setListingStatus(data.listing_status ?? '')
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
    setMatchedGyms([])
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
      const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-listing/search?${params}`, {
        headers: { Accept: 'application/json' },
      })
      const data = await res.json()
      if (data.found && data.gyms?.length > 0) {
        setMatchedGyms(data.gyms)
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
            {listingStatus === 'live'
              ? 'Your listing is now live on GymDues.'
              : 'Our team will review your listing and get it live within 24–48 hours.'}
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

            {matchedGyms.length > 0 && (
              <div className='border border-yellow-300 bg-yellow-50 rounded-lg p-4 space-y-3'>
                <p className='font-semibold text-yellow-900'>
                  {matchedGyms.length === 1
                    ? 'We found a matching gym'
                    : `We found ${matchedGyms.length} matching gyms`}
                </p>
                <p className='text-sm text-yellow-800'>
                  {matchedGyms.length === 1
                    ? 'This gym is already listed on GymDues. Would you like to claim it instead?'
                    : 'These gyms are already listed on GymDues. Would you like to claim one?'}
                </p>
                {matchedGyms.map((gym) => (
                  <div key={gym.id} className='flex items-center justify-between gap-3 bg-white rounded-md border border-yellow-200 px-3 py-2'>
                    <span className='text-sm font-medium'>
                      {gym.name}
                      <span className='text-muted-foreground font-normal ml-1'>
                        — {gym.city}{gym.state ? `, ${gym.state}` : ''}
                      </span>
                    </span>
                    <Button
                      type='button'
                      size='sm'
                      onClick={() => router.push(`/gyms/${gym.slug ?? gym.id}`)}
                    >
                      Claim
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() => {
                    setMatchedGyms([])
                    setForm((f) => ({
                      ...f,
                      gymName: searchName.trim(),
                      city: searchCity.trim(),
                      state: searchState.trim(),
                    }))
                    setStep(2)
                  }}
                >
                  None of these — list a new gym
                </Button>
              </div>
            )}

            <Field label='Gym name' error={searchError || undefined}>
              <Input
                placeholder='e.g. Iron Gym Downtown'
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value)
                  setSearchError('')
                  setMatchedGyms([])
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
                    setMatchedGyms([])
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
                    {GYM_TYPES.map(({ value, label }) => (
                      <label
                        key={value}
                        className={`flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer text-sm transition-colors ${
                          form.gymTypes.includes(value)
                            ? 'border-primary bg-primary/5'
                            : 'border-input hover:border-primary/50'
                        }`}
                      >
                        <input
                          type='checkbox'
                          className='accent-primary shrink-0'
                          checked={form.gymTypes.includes(value)}
                          onChange={() => toggleGymType(value)}
                        />
                        {label}
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
                {/* ── Phase 1: Owner details ── */}
                {step7Phase === 1 && (
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
                          <option key={r} value={r}>{r}</option>
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

                    <div className='flex flex-col gap-1'>
                      <label className='flex items-start gap-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={step7SmsConsent}
                          onChange={(e) => {
                            setStep7SmsConsent(e.target.checked)
                            setStep7SmsConsentError('')
                          }}
                          className='mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary cursor-pointer'
                        />
                        <span className='text-sm text-muted-foreground leading-snug'>
                          I consent to receive SMS or phone messages from{' '}
                          <span className='font-medium text-foreground'>GymDues</span>{' '}
                          on the number provided above for ownership verification.
                        </span>
                      </label>
                      {step7SmsConsentError && (
                        <p className='text-xs text-red-500'>{step7SmsConsentError}</p>
                      )}
                    </div>
                  </>
                )}

                {/* ── Phase 2: Verification method selection + OTP/document ── */}
                {step7Phase === 2 && (() => {
                  const methodMap: Record<string, { id: 'email' | 'phone' | 'document'; icon: typeof Mail; title: string; description: string; badge: string }> = {
                    email_matched: { id: 'email', icon: Mail, title: 'Business Email', description: `We'll send a verification code to ${form.ownerEmail}.`, badge: 'Instant' },
                    email_domain:  { id: 'email', icon: Mail, title: 'Business Email', description: `We'll send a verification code to ${form.ownerEmail}.`, badge: 'Instant' },
                    phone_matched: { id: 'phone', icon: Phone, title: 'Phone Verification', description: 'Send a code to your phone number to verify ownership.', badge: 'Instant' },
                    phone_sms:     { id: 'phone', icon: Phone, title: 'Phone Verification', description: 'Send a code to your phone number to verify ownership.', badge: 'Instant' },
                    document:      { id: 'document', icon: FileText, title: 'Document Upload', description: 'Upload a business license or tax document for manual review.', badge: '24–48 hrs' },
                  }
                  const verificationMethods = step7AvailableMethods
                    .map((m) => methodMap[m])
                    .filter((v, i, arr) => v && arr.findIndex((x) => x?.id === v.id) === i) // dedupe by id

                  const showOtp = (step7SelMethod === 'email' && step7EmailCodeSent) || (step7SelMethod === 'phone' && step7PhoneCodeSent)

                  return (
                    <>
                      <h2 className='text-2xl font-semibold'>Verify ownership</h2>
                      <p className='text-sm text-muted-foreground'>
                        Choose how you&apos;d like to verify ownership of your gym.
                      </p>

                      {showOtp ? (
                        /* ── OTP entry ── */
                        <div className='space-y-4'>
                          <div className='flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 dark:border-green-800 dark:bg-green-900/20'>
                            <CheckCircle className='h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400' />
                            <p className='text-xs text-green-800 dark:text-green-300'>
                              {step7SelMethod === 'email'
                                ? <> A 6-digit code was sent to <strong>{form.ownerEmail}</strong>. Enter it below to verify.</>
                                : <> A 6-digit code was sent to <strong>{step7SelectedPhone}</strong>. Enter it below to verify.</>
                              }
                            </p>
                          </div>

                          <div>
                            <label className='block text-sm font-medium text-muted-foreground mb-2'>
                              6-digit verification code
                            </label>
                            <div className='flex gap-2'>
                              {Array.from({ length: 6 }).map((_, i) => {
                                const currentCode = step7SelMethod === 'email' ? step7EmailCode : step7PhoneCode
                                const setCurrentCode = step7SelMethod === 'email' ? setStep7EmailCode : setStep7PhoneCode
                                return (
                                  <input
                                    key={i}
                                    ref={(el) => { step7OtpRefs.current[i] = el }}
                                    type='text'
                                    inputMode='numeric'
                                    maxLength={1}
                                    value={currentCode[i] || ''}
                                    autoFocus={i === 0}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => {
                                      const digit = e.target.value.replace(/\D/g, '').slice(-1)
                                      const digits = Array.from({ length: 6 }, (_, j) => currentCode[j] || '')
                                      digits[i] = digit
                                      setCurrentCode(digits.join(''))
                                      if (digit && i < 5) step7OtpRefs.current[i + 1]?.focus()
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Backspace' && !currentCode[i] && i > 0) {
                                        step7OtpRefs.current[i - 1]?.focus()
                                      }
                                    }}
                                    onPaste={(e) => {
                                      e.preventDefault()
                                      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
                                      setCurrentCode(pasted)
                                      step7OtpRefs.current[Math.min(pasted.length, 5)]?.focus()
                                    }}
                                    className='h-12 w-10 rounded-lg border border-input bg-background text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring'
                                  />
                                )
                              })}
                            </div>
                          </div>

                          {step7VerifError && (
                            <p className='text-xs text-red-500' role='alert'>{step7VerifError}</p>
                          )}

                          <Button
                            type='button'
                            className='w-full'
                            onClick={handleStep7OtpVerify}
                            disabled={step7VerifyLoading}
                          >
                            {step7VerifyLoading ? 'Verifying…' : 'Verify & continue'}
                          </Button>
                        </div>
                      ) : (
                        /* ── Method cards ── */
                        <div className='space-y-2'>
                          {verificationMethods.map(({ id, icon: Icon, title, description, badge }) => (
                            <div key={id}>
                              <button
                                type='button'
                                onClick={() => {
                                  setStep7SelMethod(id)
                                  setForm((f) => ({ ...f, verificationMethod: id }))
                                  setStep7VerifError('')
                                }}
                                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                                  step7SelMethod === id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                }`}
                              >
                                <div className='flex items-start gap-3'>
                                  <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                                    step7SelMethod === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                  }`}>
                                    <Icon className='h-5 w-5' />
                                  </div>
                                  <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2'>
                                      <p className='text-base font-semibold'>{title}</p>
                                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                        badge === 'Instant'
                                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                      }`}>
                                        {badge}
                                      </span>
                                    </div>
                                    <p className='text-sm text-muted-foreground mt-0.5'>{description}</p>
                                  </div>
                                </div>
                              </button>

                              {/* Email expanded panel */}
                              {id === 'email' && step7SelMethod === 'email' && (
                                <div className='mt-2 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3'>
                                  <div className='flex gap-2'>
                                    <input
                                      type='text'
                                      value={form.ownerEmail}
                                      readOnly
                                      className='flex-1 rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground'
                                    />
                                    <button
                                      type='button'
                                      disabled={step7SendingCode}
                                      onClick={async () => {
                                        if (!claimId) return
                                        setStep7SendingCode(true)
                                        setStep7VerifError('')
                                        try {
                                          const r = await fetch(`${getApiBaseUrl()}/api/v1/gym-claims/${claimId}/send-email-code`, {
                                            method: 'POST', headers: { Accept: 'application/json' },
                                          })
                                          if (!r.ok) {
                                            const d = await r.json().catch(() => ({}))
                                            setStep7VerifError(d.message ?? 'Failed to send code.')
                                            return
                                          }
                                          setStep7EmailCodeSent(true)
                                        } catch { setStep7VerifError('Network error. Please try again.') }
                                        finally { setStep7SendingCode(false) }
                                      }}
                                      className='rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap'
                                    >
                                      {step7SendingCode ? '…' : 'Send code'}
                                    </button>
                                  </div>
                                  {step7VerifError && <p className='text-xs text-red-500'>{step7VerifError}</p>}
                                </div>
                              )}

                              {/* Phone expanded panel */}
                              {id === 'phone' && step7SelMethod === 'phone' && (
                                <div className='mt-2 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3'>
                                  <div className='space-y-1.5'>
                                    {[form.ownerPhone].filter(Boolean).map((num) => (
                                      <label
                                        key={num}
                                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                                          step7SelectedPhone === num ? 'border-primary bg-primary/5' : 'border-input bg-background hover:border-primary/50'
                                        }`}
                                      >
                                        <input
                                          type='radio'
                                          name='step7-phone'
                                          value={num}
                                          checked={step7SelectedPhone === num}
                                          onChange={() => { setStep7SelectedPhone(num); setStep7VerifError('') }}
                                          className='accent-primary'
                                        />
                                        <span className='text-sm font-mono font-medium'>{num}</span>
                                      </label>
                                    ))}
                                  </div>
                                  <button
                                    type='button'
                                    disabled={step7SendingCode || !step7SelectedPhone}
                                    onClick={async () => {
                                      if (!claimId) return
                                      setStep7SendingCode(true)
                                      setStep7VerifError('')
                                      try {
                                        const r = await fetch(`${getApiBaseUrl()}/api/v1/gym-claims/${claimId}/send-phone-code`, {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                                          body: JSON.stringify({ phone_number: step7SelectedPhone }),
                                        })
                                        if (!r.ok) {
                                          const d = await r.json().catch(() => ({}))
                                          setStep7VerifError(d.message ?? 'Failed to send code.')
                                          return
                                        }
                                        setStep7PhoneCodeSent(true)
                                      } catch { setStep7VerifError('Network error. Please try again.') }
                                      finally { setStep7SendingCode(false) }
                                    }}
                                    className='w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                                  >
                                    {step7SendingCode ? 'Sending…' : 'Send verification code'}
                                  </button>
                                  {step7VerifError && <p className='text-xs text-red-500'>{step7VerifError}</p>}
                                </div>
                              )}

                              {/* Document expanded panel */}
                              {id === 'document' && step7SelMethod === 'document' && (
                                <div className='mt-2 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3'>
                                  <select
                                    value={step7DocType}
                                    onChange={(e) => { setStep7DocType(e.target.value); setStep7VerifError('') }}
                                    className='w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
                                  >
                                    <option value='' disabled>Select document type</option>
                                    <option value='business_license'>Business license or registration certificate</option>
                                    <option value='tax_document'>Tax document (EIN letter / business tax return)</option>
                                    <option value='other'>Other ownership proof</option>
                                  </select>

                                  <input
                                    ref={docRef}
                                    type='file'
                                    accept='.pdf,.jpg,.jpeg,.png'
                                    className='hidden'
                                    onChange={(e) => {
                                      setForm((f) => ({ ...f, verificationDoc: e.target.files?.[0] ?? null }))
                                      setStep7VerifError('')
                                    }}
                                  />
                                  <button
                                    type='button'
                                    onClick={() => docRef.current?.click()}
                                    className='w-full rounded-lg border-2 border-dashed border-primary/30 px-4 py-4 text-center text-sm text-muted-foreground hover:border-primary/60 hover:text-foreground transition-colors'
                                  >
                                    {form.verificationDoc
                                      ? <span className='text-foreground font-medium'>{form.verificationDoc.name}</span>
                                      : 'Click to choose a file (PDF, JPG, PNG — max 10 MB)'
                                    }
                                  </button>
                                  {form.verificationDoc && (
                                    <button
                                      type='button'
                                      onClick={() => setForm((f) => ({ ...f, verificationDoc: null }))}
                                      className='text-xs text-muted-foreground hover:text-red-500'
                                    >
                                      Remove file
                                    </button>
                                  )}

                                  <p className='rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300'>
                                    Our team will review your documents within 24–48 hours and notify you by email.
                                  </p>

                                  {step7VerifError && <p className='text-xs text-red-500'>{step7VerifError}</p>}

                                  <Button
                                    type='button'
                                    className='w-full'
                                    onClick={handleStep7DocUpload}
                                    disabled={step7VerifyLoading}
                                  >
                                    {step7VerifyLoading ? 'Uploading…' : 'Upload & continue'}
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}

                          {step7VerifError && !['email', 'phone', 'document'].includes(step7SelMethod) && (
                            <p className='text-xs text-red-500'>{step7VerifError}</p>
                          )}
                        </div>
                      )}
                    </>
                  )
                })()}
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
                  <ReviewRow
                    label='Type'
                    value={form.gymTypes
                      .map((v) => GYM_TYPES.find((t) => t.value === v)?.label ?? v)
                      .join(', ')}
                  />
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
                  <ReviewRow
                    label='Cover'
                    value={form.coverPhoto ? form.coverPhoto.name : draftPhotoInfo.coverPhoto ? 'Previously uploaded' : 'None'}
                  />
                  <ReviewRow
                    label='Gallery'
                    value={
                      form.galleryPhotos.length > 0
                        ? `${form.galleryPhotos.length} photo(s)`
                        : draftPhotoInfo.galleryCount != null
                          ? `${draftPhotoInfo.galleryCount} photo(s) previously uploaded`
                          : 'None'
                    }
                  />
                  <ReviewRow
                    label='Logo'
                    value={form.logo ? form.logo.name : draftPhotoInfo.logo ? 'Previously uploaded' : 'None'}
                  />
                </ReviewSection>

                <ReviewSection title='Verification' onEdit={() => goEditStep(7)}>
                  <ReviewRow label='Name' value={form.ownerName} />
                  <ReviewRow label='Role' value={form.ownerRole} />
                  <ReviewRow label='Email' value={form.ownerEmail} />
                  <ReviewRow label='Phone' value={form.ownerPhone} />
                  <ReviewRow
                    label='Method'
                    value={
                      { email: 'Email verification', phone: 'Phone verification', document: 'Document upload' }[form.verificationMethod]
                      ?? form.verificationMethod
                      ?? '—'
                    }
                  />
                  {form.verificationMethod === 'document' && form.verificationDoc && (
                    <ReviewRow label='Document' value={form.verificationDoc.name} />
                  )}
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
            {stepError && <p className='text-red-500 text-sm'>{stepError}</p>}
            <div className='flex justify-between pt-2'>
              <Button type='button' variant='outline' onClick={handleBack} disabled={stepLoading || step7VerifyLoading}>
                {fromReview && !(step === 7 && step7Phase === 2) ? 'Back to review' : 'Back'}
              </Button>
              {/* Step 7 phase 2: inline buttons handle the action — no Next button here */}
              {!(step === 7 && step7Phase === 2) && (
                step < 8 ? (
                  <Button type='button' onClick={handleNext} disabled={stepLoading}>
                    {stepLoading ? 'Saving…' : fromReview ? 'Save & back to review' : 'Next'}
                  </Button>
                ) : (
                  <Button type='submit' disabled={submitLoading}>
                    {submitLoading ? 'Submitting…' : 'Submit listing'}
                  </Button>
                )
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

