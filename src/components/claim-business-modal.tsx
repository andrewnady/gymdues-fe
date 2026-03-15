'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Building2, CheckCircle, Mail, Phone, FileText, ChevronRight, Clock } from 'lucide-react'
import { getApiBaseUrl } from '@/lib/api-config'

type VerificationMethod = 'email' | 'phone' | 'document' | null

interface ClaimBusinessModalProps {
  open: boolean
  onClose: () => void
  onClaimed?: () => void
  gymId: number
  gymName: string
  gymWebsite?: string
  gymPhones?: string[]
}

function extractDomain(website: string): string {
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`)
    return url.hostname.replace(/^www\./, '')
  } catch {
    return website.replace(/^(?:https?:\/\/)?(?:www\.)?/, '').split('/')[0]
  }
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return '(***) ***-****'
  const last4 = digits.slice(-4)
  return `(***) ***-${last4}`
}

export function ClaimBusinessModal({ open, onClose, onClaimed, gymId, gymName, gymWebsite, gymPhones }: ClaimBusinessModalProps) {
  // Step 1: Account info
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', phone: '', role: '' })

  // Step 2: Verification
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>(null)
  // Method 1: Business email domain match
  const [bizEmail, setBizEmail] = useState('')
  const [bizEmailCode, setBizEmailCode] = useState('')
  const [bizEmailCodeSent, setBizEmailCodeSent] = useState(false)
  // Method 2: Phone to gym's listed number
  const [selectedPhone, setSelectedPhone] = useState<string>('')
  const [phoneCode, setPhoneCode] = useState('')
  const [phoneCodeSent, setPhoneCodeSent] = useState(false)
  // Method 3: Document upload
  const [docType, setDocType] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // API state
  const [claimId, setClaimId] = useState<number | null>(null)
  const [availableMethods, setAvailableMethods] = useState<string[]>([])
  const [initiating, setInitiating] = useState(false)

  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [sendingCode, setSendingCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [underReview, setUnderReview] = useState(false)

  const gymDomain = gymWebsite ? extractDomain(gymWebsite) : null

  const validateStep1 = () => {
    const errors = { name: '', email: '', phone: '', role: '' }
    if (!name.trim()) {
      errors.name = 'Full name is required.'
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      errors.name = 'Full name must contain only letters and spaces.'
    }
    if (!email.trim()) {
      errors.email = 'Business email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!phone.trim()) {
      errors.phone = 'Phone number is required.'
    } else if (!/^\+?[\d\s\-().]+$/.test(phone.trim()) || phone.replace(/\D/g, '').length < 7) {
      errors.phone = 'Please enter a valid phone number.'
    }
    if (!role.trim()) errors.role = 'Please select a role.'
    return errors
  }

  const handleNextStep = async () => {
    const errors = validateStep1()
    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({ name: '', email: '', phone: '', role: '' })
    setInitiating(true)
    setSubmitError(null)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-claims/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          gym_id: gymId,
          full_name: name,
          job_title: role,
          business_email: email,
          phone_number: phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.message ?? 'Failed to initiate claim. Please try again.')
        return
      }
      const claimIdValue: number = data.claim_id
      const methods: string[] = data.available_methods ?? []
      setClaimId(claimIdValue)
      setAvailableMethods(methods)
      setBizEmail(email)

      const emailMatched = methods.includes('email_matched')
      const phoneMatched = methods.includes('phone_matched')

      if (emailMatched || phoneMatched) {
        // Auto-send OTPs — email/phone found directly in gym contacts
        const sendPromises: Promise<void>[] = []

        if (emailMatched) {
          sendPromises.push(
            fetch(`${getApiBaseUrl()}/api/v1/gym-claims/${claimIdValue}/send-email-code`, {
              method: 'POST',
              headers: { Accept: 'application/json' },
            }).then(async (r) => {
              const d = await r.json()
              if (r.ok) {
                setBizEmailCodeSent(true)
                setVerificationMethod('email')
              } else {
                setVerificationError(d.message ?? 'Failed to send email verification code.')
              }
            })
          )
        }

        if (phoneMatched) {
          setSelectedPhone(phone)
          sendPromises.push(
            fetch(`${getApiBaseUrl()}/api/v1/gym-claims/${claimIdValue}/send-phone-code`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify({ phone_number: phone }),
            }).then(async (r) => {
              const d = await r.json()
              if (r.ok) {
                setPhoneCodeSent(true)
                if (!emailMatched) setVerificationMethod('phone')
              } else {
                setVerificationError(d.message ?? 'Failed to send SMS verification code.')
              }
            })
          )
        }

        await Promise.all(sendPromises)
      }

      setStep(2)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setInitiating(false)
    }
  }

  const handleSendEmailCode = async () => {
    if (!claimId) return
    setVerificationError(null)
    setSendingCode(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-claims/${claimId}/send-email-code`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) {
        setVerificationError(data.message ?? 'Failed to send verification code.')
        return
      }
      setBizEmailCodeSent(true)
    } catch {
      setVerificationError('Network error. Please try again.')
    } finally {
      setSendingCode(false)
    }
  }

  const handleSendPhoneCode = async () => {
    if (!claimId) return
    setVerificationError(null)
    setSendingCode(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-claims/${claimId}/send-phone-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ phone_number: selectedPhone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setVerificationError(data.message ?? 'Failed to send SMS code.')
        return
      }
      setPhoneCodeSent(true)
    } catch {
      setVerificationError('Network error. Please try again.')
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerificationError(null)

    if (!verificationMethod) {
      setVerificationError('Please select a verification method.')
      return
    }
    if (verificationMethod === 'email' && (!bizEmailCodeSent || !bizEmailCode.trim())) {
      setVerificationError('Please send and enter the verification code.')
      return
    }
    if (verificationMethod === 'phone' && (!phoneCodeSent || !phoneCode.trim())) {
      setVerificationError('Please send and enter the SMS verification code.')
      return
    }
    if (verificationMethod === 'document') {
      if (!docType) {
        setVerificationError('Please select a document type.')
        return
      }
      if (!uploadedFile) {
        setVerificationError('Please upload a document.')
        return
      }
    }

    if (!claimId) {
      setSubmitError('Session expired. Please close and try again.')
      return
    }

    setSubmitError(null)
    setLoading(true)
    try {
      let res: Response
      if (verificationMethod === 'email') {
        res = await fetch(`${getApiBaseUrl()}/api/v1/gym-claims/${claimId}/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ code: bizEmailCode }),
        })
      } else if (verificationMethod === 'phone') {
        res = await fetch(`${getApiBaseUrl()}/api/v1/gym-claims/${claimId}/verify-phone`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ code: phoneCode }),
        })
      } else {
        const formData = new FormData()
        formData.append('document', uploadedFile!)
        res = await fetch(`${getApiBaseUrl()}/api/v1/gym-claims/${claimId}/upload-document`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        })
      }

      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.message ?? 'Something went wrong. Please try again.')
        return
      }
      if (verificationMethod === 'document') {
        setUnderReview(true)
      } else {
        setSubmitted(true)
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setName('')
    setEmail('')
    setPhone('')
    setRole('')
    setFieldErrors({ name: '', email: '', phone: '', role: '' })
    setClaimId(null)
    setAvailableMethods([])
    setInitiating(false)
    setVerificationMethod(null)
    setBizEmail('')
    setBizEmailCode('')
    setBizEmailCodeSent(false)
    setSelectedPhone('')
    setPhoneCode('')
    setPhoneCodeSent(false)
    setDocType('')
    setUploadedFile(null)
    setVerificationError(null)
    setSubmitError(null)
    setSubmitted(false)
    setUnderReview(false)
    onClose()
  }

  const handleMethodSelect = (method: VerificationMethod) => {
    setVerificationMethod((prev) => (prev === method ? null : method))
    setVerificationError(null)
  }

  // Auto-select the first available verification method when entering step 2
  useEffect(() => {
    if (step !== 2) return
    const methodMap: Record<string, VerificationMethod> = {
      email_domain: 'email',
      phone_sms: 'phone',
      document: 'document',
    }
    const first = availableMethods.map((m) => methodMap[m]).find(Boolean) ?? 'document'
    setVerificationMethod(first)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])


  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  const verificationMethods = [
    ...(availableMethods.includes('email_domain') ? [{
      id: 'email' as const,
      icon: Mail,
      title: 'Business Email',
      description: gymDomain ? `Verify with an email matching @${gymDomain}.` : 'Verify using your business email address.',
      badge: 'Instant',
    }] : []),
    ...(availableMethods.includes('phone_sms') ? [{
      id: 'phone' as const,
      icon: Phone,
      title: 'Phone Verification',
      description: gymPhones && gymPhones.length > 0
        ? gymPhones.length === 1
          ? `Send a code to the number on file (${maskPhone(gymPhones[0])}) or your own number.`
          : `Send a code to one of ${gymPhones.length} numbers on file, or your own number.`
        : 'Send a code to your phone number to verify ownership.',
      badge: 'Instant',
    }] : []),
    ...(availableMethods.includes('document') ? [{
      id: 'document' as const,
      icon: FileText,
      title: 'Document Upload',
      description: 'Upload a business license or tax document for manual review.',
      badge: '24–48 hrs',
    }] : []),
  ]

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-business-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            id="claim-business-modal-title"
            className="text-xl font-semibold flex items-center gap-2"
          >
            <Building2 className="h-5 w-5 text-primary" aria-hidden />
            Claim {gymName}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {underReview ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Clock className="h-12 w-12 text-amber-500" />
            <h3 className="text-base font-semibold">Claim under review</h3>
            <p className="text-sm text-muted-foreground">
              We&apos;ve received your documents for <strong>{gymName}</strong>. Our team will
              review your submission and notify <strong>{email}</strong> within 24–48 hours.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        ) : submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h3 className="text-base font-semibold">Claim provisionally approved!</h3>
            <p className="text-sm text-muted-foreground">
              We&apos;ve verified your ownership of <strong>{gymName}</strong>. A confirmation has
              been sent to <strong>{email}</strong>.
            </p>
            <button
              type="button"
              onClick={() => {
                handleClose()
                onClaimed?.()
              }}
              className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-5">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      step === s
                        ? 'bg-primary text-primary-foreground'
                        : step > s
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s ? <CheckCircle className="h-3.5 w-3.5" /> : s}
                  </div>
                  <span
                    className={`text-xs font-medium ${step === s ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {s === 1 ? 'Account Info' : 'Verification'}
                  </span>
                  {s < 2 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
              ))}
            </div>

            {/* Step 1: Account Info */}
            {step === 1 && (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Are you the owner or manager of <strong>{gymName}</strong>? Fill in your details
                  and we&apos;ll verify your claim.
                </p>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="claim-name"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Full name *
                    </label>
                    <input
                      id="claim-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))
                        setFieldErrors((prev) => ({ ...prev, name: '' }))
                      }}
                      className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${fieldErrors.name ? 'border-destructive' : 'border-input'}`}
                      placeholder="Your full name"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="claim-email"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Business email *
                    </label>
                    <input
                      id="claim-email"
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setFieldErrors((prev) => ({ ...prev, email: '' }))
                      }}
                      className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${fieldErrors.email ? 'border-destructive' : 'border-input'}`}
                      placeholder="you@yourgym.com"
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="claim-phone"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Phone number *
                    </label>
                    <input
                      id="claim-phone"
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/[^0-9+\-().\s]/g, ''))
                        setFieldErrors((prev) => ({ ...prev, phone: '' }))
                      }}
                      className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${fieldErrors.phone ? 'border-destructive' : 'border-input'}`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="claim-role"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Your role *
                    </label>
                    <select
                      id="claim-role"
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value)
                        setFieldErrors((prev) => ({ ...prev, role: '' }))
                      }}
                      className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${fieldErrors.role ? 'border-destructive' : 'border-input'}`}
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      <option value="owner">Owner</option>
                      <option value="manager">Manager</option>
                      <option value="director">Director</option>
                      <option value="marketing_manager">Marketing Manager</option>
                    </select>
                    {fieldErrors.role && (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors.role}</p>
                    )}
                  </div>
                  {submitError && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2" role="alert">
                      {submitError}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={initiating}
                      className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      {initiating ? 'Please wait…' : 'Next'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Verification */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <p
                    className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
                    role="alert"
                  >
                    {submitError}
                  </p>
                )}

                {/* OTP entry view — shown after code is sent for email or phone */}
                {(bizEmailCodeSent || phoneCodeSent) ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 dark:border-green-800 dark:bg-green-900/20">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                      <p className="text-xs text-green-800 dark:text-green-300">
                        {bizEmailCodeSent && phoneCodeSent
                          ? <>6-digit codes were sent to <strong>{bizEmail}</strong> and <strong>{maskPhone(selectedPhone)}</strong>. Enter either code below to verify.</>
                          : bizEmailCodeSent
                            ? <>A 6-digit code was sent to <strong>{bizEmail}</strong>. Enter it below to verify.</>
                            : <>A 6-digit code was sent to <strong>{maskPhone(selectedPhone)}</strong>. Enter it below to verify.</>
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        6-digit verification code
                      </label>
                      <div className="flex gap-2 justify-center">
                        {Array.from({ length: 6 }).map((_, i) => {
                          const currentOtp = bizEmailCodeSent ? bizEmailCode : phoneCode
                          const setCurrentOtp = bizEmailCodeSent ? setBizEmailCode : setPhoneCode
                          return (
                            <input
                              key={i}
                              ref={(el) => { otpRefs.current[i] = el }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={currentOtp[i] || ''}
                              autoFocus={i === 0}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const digit = e.target.value.replace(/\D/g, '').slice(-1)
                                const digits = Array.from({ length: 6 }, (_, j) => currentOtp[j] || '')
                                digits[i] = digit
                                setCurrentOtp(digits.join(''))
                                if (digit && i < 5) otpRefs.current[i + 1]?.focus()
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !currentOtp[i] && i > 0) {
                                  otpRefs.current[i - 1]?.focus()
                                }
                              }}
                              onPaste={(e) => {
                                e.preventDefault()
                                const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
                                setCurrentOtp(pasted)
                                otpRefs.current[Math.min(pasted.length, 5)]?.focus()
                              }}
                              className="h-12 w-10 rounded-lg border border-input bg-background text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          )
                        })}
                      </div>
                    </div>
                    {verificationError && (
                      <p className="text-xs text-destructive" role="alert">
                        {verificationError}
                      </p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setBizEmailCodeSent(false)
                          setBizEmailCode('')
                          setPhoneCodeSent(false)
                          setPhoneCode('')
                          setVerificationError(null)
                        }}
                        className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                      >
                        {loading ? 'Submitting…' : 'Submit claim'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Choose how you&apos;d like to verify ownership of <strong>{gymName}</strong>.
                    </p>

                    {/* Method cards */}
                    <div className="space-y-2">
                      {verificationMethods.map(({ id, icon: Icon, title, description, badge }) => (
                        <div key={id}>
                          <button
                            type="button"
                            onClick={() => handleMethodSelect(id)}
                            className={`w-full rounded-xl border p-4 text-left transition-colors ${
                              verificationMethod === id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                                  verificationMethod === id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-base font-semibold">{title}</p>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                      badge === 'Instant'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                    }`}
                                  >
                                    {badge}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                              </div>
                            </div>
                          </button>

                          {/* Business Email fields */}
                          {id === 'email' && verificationMethod === 'email' && (
                            <div className="mt-2 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
                              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-900/20">
                                <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                                <p className="text-xs text-green-800 dark:text-green-300">
                                  Your email <strong>{bizEmail}</strong> matches this business&apos;s domain.
                                  We&apos;ll send a verification code to confirm ownership.
                                </p>
                              </div>
                              <div>
                                <label
                                  htmlFor="biz-email"
                                  className="block text-xs font-medium text-muted-foreground mb-1"
                                >
                                  Verification email
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    id="biz-email"
                                    type="text"
                                    value={bizEmail}
                                    readOnly
                                    className="flex-1 rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleSendEmailCode}
                                    disabled={sendingCode}
                                    className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap"
                                  >
                                    {sendingCode ? '…' : 'Send code'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Phone Verification fields */}
                          {id === 'phone' && verificationMethod === 'phone' && (
                            <div className="mt-2 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
                              {(() => {
                                const userPhoneNorm = phone.replace(/\D/g, '')
                                const businessPhones = gymPhones ?? []
                                const isUserPhoneInList = businessPhones.some(
                                  (n) => n.replace(/\D/g, '') === userPhoneNorm
                                )
                                const allPhones: { num: string; isUser: boolean }[] = [
                                  ...businessPhones.map((n) => ({ num: n, isUser: false })),
                                  ...(phone && !isUserPhoneInList ? [{ num: phone, isUser: true }] : []),
                                ]
                                return (
                                  <>
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground mb-1.5">
                                        Select a number to receive the code
                                      </p>
                                      <div className="space-y-1.5">
                                        {allPhones.map(({ num, isUser }) => (
                                          <label
                                            key={num}
                                            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                                              selectedPhone === num
                                                ? 'border-primary bg-primary/5'
                                                : 'border-input bg-background hover:border-primary/50'
                                            }`}
                                          >
                                            <input
                                              type="radio"
                                              name="gym-phone"
                                              value={num}
                                              checked={selectedPhone === num}
                                              onChange={() => {
                                                setSelectedPhone(num)
                                                setVerificationError(null)
                                              }}
                                              className="accent-primary"
                                            />
                                            <span className="text-sm font-mono font-medium">{maskPhone(num)}</span>
                                            {isUser && (
                                              <span className="ml-auto text-[10px] font-medium rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                                                Your number
                                              </span>
                                            )}
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleSendPhoneCode}
                                      disabled={sendingCode || !selectedPhone}
                                      className="w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                    >
                                      {sendingCode ? 'Sending…' : 'Send verification code'}
                                    </button>
                                  </>
                                )
                              })()}
                            </div>
                          )}

                          {/* Document Upload fields */}
                          {id === 'document' && verificationMethod === 'document' && (
                            <div className="mt-2 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
                              <div>
                                <label
                                  htmlFor="doc-type"
                                  className="block text-xs font-medium text-muted-foreground mb-1"
                                >
                                  Document type
                                </label>
                                <select
                                  id="doc-type"
                                  value={docType}
                                  onChange={(e) => {
                                    setDocType(e.target.value)
                                    setVerificationError(null)
                                  }}
                                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                  <option value="" disabled>
                                    Select document type
                                  </option>
                                  <option value="business_license">
                                    Business license or registration certificate
                                  </option>
                                  <option value="tax_document">
                                    Tax document (EIN letter / business tax return)
                                  </option>
                                  <option value="other">Other ownership proof</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                  Upload document{' '}
                                  <span className="font-normal">(PDF, JPG, PNG — max 10 MB)</span>
                                </label>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={(e) => {
                                    setUploadedFile(e.target.files?.[0] ?? null)
                                    setVerificationError(null)
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="w-full rounded-lg border-2 border-dashed border-primary/30 px-4 py-4 text-center text-sm text-muted-foreground hover:border-primary/60 hover:text-foreground transition-colors"
                                >
                                  {uploadedFile ? (
                                    <span className="text-foreground font-medium">
                                      {uploadedFile.name}
                                    </span>
                                  ) : (
                                    'Click to choose a file'
                                  )}
                                </button>
                                {uploadedFile && (
                                  <button
                                    type="button"
                                    onClick={() => setUploadedFile(null)}
                                    className="mt-1.5 text-xs text-muted-foreground hover:text-destructive"
                                  >
                                    Remove file
                                  </button>
                                )}
                              </div>
                              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                                Our team will review your documents within 24–48 hours and notify you
                                by email.
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {verificationError && (
                      <p className="text-xs text-destructive" role="alert">
                        {verificationError}
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                      >
                        {loading ? 'Submitting…' : 'Submit claim'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
