'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle, CheckCircle, ChevronRight, Clock, Upload } from 'lucide-react'
import { getApiBaseUrl } from '@/lib/api-config'

interface DisputeModalProps {
  open: boolean
  onClose: () => void
  gymId: number
  gymName: string
}

export function DisputeModal({ open, onClose, gymId, gymName }: DisputeModalProps) {
  // Step 1: Information
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ name: '', jobTitle: '', email: '', phone: '' })

  // Step 2: Document
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // API state
  const [disputeId, setDisputeId] = useState<number | null>(null)
  const [initiating, setInitiating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [docError, setDocError] = useState<string | null>(null)
  const [underReview, setUnderReview] = useState(false)

  const validateStep1 = () => {
    const errors = { name: '', jobTitle: '', email: '', phone: '' }
    if (!name.trim()) {
      errors.name = 'Full name is required.'
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      errors.name = 'Full name must contain only letters and spaces.'
    }
    if (!jobTitle.trim()) errors.jobTitle = 'Job title is required.'
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
    return errors
  }

  const handleNextStep = async () => {
    const errors = validateStep1()
    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({ name: '', jobTitle: '', email: '', phone: '' })
    setInitiating(true)
    setSubmitError(null)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          gym_id: gymId,
          full_name: name,
          job_title: jobTitle,
          business_email: email,
          phone_number: phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.message ?? 'Failed to submit dispute. Please try again.')
        return
      }
      setDisputeId(data.dispute_id)
      setStep(2)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setInitiating(false)
    }
  }

  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    setDocError(null)

    if (!uploadedFile) {
      setDocError('Please upload a document.')
      return
    }
    if (!disputeId) {
      setDocError('Session expired. Please close and try again.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('document', uploadedFile)
      const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-disputes/${disputeId}/upload-document`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setDocError(data.message ?? 'Document upload failed. Please try again.')
        return
      }
      setUnderReview(true)
    } catch {
      setDocError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setName('')
    setJobTitle('')
    setEmail('')
    setPhone('')
    setFieldErrors({ name: '', jobTitle: '', email: '', phone: '' })
    setDisputeId(null)
    setInitiating(false)
    setUploadedFile(null)
    setSubmitError(null)
    setDocError(null)
    setUnderReview(false)
    onClose()
  }

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

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dispute-modal-title"
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
            id="dispute-modal-title"
            className="text-xl font-semibold flex items-center gap-2"
          >
            <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden />
            Dispute Claim for {gymName}
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
            <h3 className="text-base font-semibold">Dispute under review</h3>
            <p className="text-sm text-muted-foreground">
              We&apos;ve received your documents for <strong>{gymName}</strong>. Our team will
              review your submission and notify <strong>{email}</strong> within 48 hours.
            </p>
            <button
              type="button"
              onClick={handleClose}
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
                    {s === 1 ? 'Your Information' : 'Ownership Documents'}
                  </span>
                  {s < 2 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
              ))}
            </div>

            {/* Step 1: Information */}
            {step === 1 && (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Believe this gym was fraudulently claimed? Provide your contact details and
                  we&apos;ll review your dispute within 48 hours.
                </p>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="dispute-name"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Full name *
                    </label>
                    <input
                      id="dispute-name"
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
                      htmlFor="dispute-email"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Business email *
                    </label>
                    <input
                      id="dispute-email"
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
                      htmlFor="dispute-phone"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Phone number *
                    </label>
                    <input
                      id="dispute-phone"
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
                      htmlFor="dispute-job-title"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Job title *
                    </label>
                    <select
                      id="dispute-job-title"
                      value={jobTitle}
                      onChange={(e) => {
                        setJobTitle(e.target.value)
                        setFieldErrors((prev) => ({ ...prev, jobTitle: '' }))
                      }}
                      className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${fieldErrors.jobTitle ? 'border-destructive' : 'border-input'}`}
                    >
                      <option value="" disabled>Select your role</option>
                      <option value="owner">Owner</option>
                      <option value="manager">Manager</option>
                      <option value="director">Director</option>
                      <option value="marketing_manager">Marketing Manager</option>
                    </select>
                    {fieldErrors.jobTitle && (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors.jobTitle}</p>
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

            {/* Step 2: Document Upload */}
            {step === 2 && (
              <form onSubmit={handleSubmitDocument} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload a document that proves your ownership of <strong>{gymName}</strong>.
                  Accepted formats: PDF, JPG, PNG (max 10 MB).
                </p>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Upload className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="text-sm font-medium">Ownership document</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Examples: business license, registration certificate, tax document (EIN
                        letter), or other official proof of ownership.
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      setUploadedFile(e.target.files?.[0] ?? null)
                      setDocError(null)
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-lg border-2 border-dashed border-primary/30 px-4 py-5 text-center text-sm text-muted-foreground hover:border-primary/60 hover:text-foreground transition-colors"
                  >
                    {uploadedFile ? (
                      <span className="text-foreground font-medium">{uploadedFile.name}</span>
                    ) : (
                      'Click to choose a file'
                    )}
                  </button>
                  {uploadedFile && (
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove file
                    </button>
                  )}

                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                    Our team will review your documents within 48 hours and notify you by email.
                    If approved, the current claim will be revoked and ownership transferred to you.
                  </p>
                </div>

                {docError && (
                  <p className="text-xs text-destructive" role="alert">
                    {docError}
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
                    {loading ? 'Uploading…' : 'Submit dispute'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
