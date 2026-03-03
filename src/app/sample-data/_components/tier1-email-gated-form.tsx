'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { DownloadSampleButton } from '@/components/download-sample-button'

export function Tier1EmailGatedForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
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
          Download 100 random gyms with basic info (name, address, city, state).
        </p>
        <DownloadSampleButton variant="primary" className="rounded-xl">
          <Download className="h-4 w-4" aria-hidden />
          Download 100 gyms (basic info)
        </DownloadSampleButton>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="t1-name" className="block text-sm font-medium text-muted-foreground mb-1.5">Name</label>
        <input
          id="t1-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="t1-email" className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
        <input
          id="t1-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="you@company.com"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Sending…' : 'Get free sample'}
      </button>
    </form>
  )
}
