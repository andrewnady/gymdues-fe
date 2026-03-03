'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { DownloadSampleButton } from '@/components/download-sample-button'

interface StateOption {
  state: string
  stateName: string
}

interface Tier2FormCompletionProps {
  states: StateOption[]
}

const USE_CASES = [
  'Marketing / Lead generation',
  'Software / SaaS sales',
  'Equipment supply',
  'Franchise development',
  'Research / Other',
]

export function Tier2FormCompletion({ states }: Tier2FormCompletionProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [useCase, setUseCase] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const selectedState = states.find((s) => s.state === stateCode)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !company.trim() || !useCase || !stateCode) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
        <p className="font-medium text-foreground mb-2">Thanks! Your sample is ready.</p>
        <p className="text-sm text-muted-foreground mb-4">
          {selectedState
            ? `Download 500 gyms from ${selectedState.stateName} with phone numbers included.`
            : 'Download 500 gyms from your selected state with phone numbers included.'}
        </p>
        <DownloadSampleButton variant="primary" className="rounded-xl">
          <Download className="h-4 w-4" aria-hidden />
          Download 500 gyms (with phone numbers)
        </DownloadSampleButton>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="t2-name" className="block text-sm font-medium text-muted-foreground mb-1.5">Name</label>
        <input id="t2-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Your name" />
      </div>
      <div>
        <label htmlFor="t2-email" className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
        <input id="t2-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@company.com" />
      </div>
      <div>
        <label htmlFor="t2-company" className="block text-sm font-medium text-muted-foreground mb-1.5">Company</label>
        <input id="t2-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} required
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Company name" />
      </div>
      <div>
        <label htmlFor="t2-usecase" className="block text-sm font-medium text-muted-foreground mb-1.5">Use case</label>
        <select id="t2-usecase" value={useCase} onChange={(e) => setUseCase(e.target.value)} required
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">Select use case</option>
          {USE_CASES.map((uc) => <option key={uc} value={uc}>{uc}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="t2-state" className="block text-sm font-medium text-muted-foreground mb-1.5">State (for 500 gyms)</label>
        <select id="t2-state" value={stateCode} onChange={(e) => setStateCode(e.target.value)} required
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">Select state</option>
          {states.map((s) => <option key={s.state} value={s.state}>{s.stateName}</option>)}
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
        {loading ? 'Sending…' : 'Get 500 gyms from state'}
      </button>
    </form>
  )
}
