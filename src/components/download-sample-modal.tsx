'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Download } from 'lucide-react'

const USE_CASES = [
  'Marketing / Lead generation',
  'Software / SaaS sales',
  'Equipment supply',
  'Franchise development',
  'Research / Other',
]

export interface DownloadSampleFormData {
  name: string
  email: string
  company: string
  useCase: string
}

interface DownloadSampleModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: DownloadSampleFormData) => void
}

export function DownloadSampleModal({ open, onClose, onSubmit }: DownloadSampleModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [useCase, setUseCase] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    onSubmit({ name: name.trim(), email: email.trim(), company: company.trim(), useCase })
    setName('')
    setEmail('')
    setCompany('')
    setUseCase('')
    setLoading(false)
    onClose()
  }

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 id="download-modal-title" className="text-lg font-semibold">
            Get your sample
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your details to receive the sample download.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="dm-name" className="block text-sm font-medium text-muted-foreground mb-1">
              Name *
            </label>
            <input
              id="dm-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="dm-email" className="block text-sm font-medium text-muted-foreground mb-1">
              Email *
            </label>
            <input
              id="dm-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="dm-company" className="block text-sm font-medium text-muted-foreground mb-1">
              Company
            </label>
            <input
              id="dm-company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Company name"
            />
          </div>
          <div>
            <label htmlFor="dm-usecase" className="block text-sm font-medium text-muted-foreground mb-1">
              Use case
            </label>
            <select
              id="dm-usecase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select use case</option>
              {USE_CASES.map((uc) => (
                <option key={uc} value={uc}>{uc}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-input px-4 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Download className="h-4 w-4" aria-hidden />
              {loading ? 'Sending…' : 'Download sample'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(modalContent, document.body)
}
