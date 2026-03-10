'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { DownloadSampleModal, type DownloadSampleFormData } from './download-sample-modal'
import { submitSampleDownload, type SampleDownloadFilters } from '@/lib/gymsdata-api'

const SAMPLE_DATA_HREF = '/gymsdata/sample-data'

interface DownloadSampleButtonProps {
  className?: string
  children?: React.ReactNode
  /** Optional variant: 'primary' (default) or 'outline' */
  variant?: 'primary' | 'outline'
  /** Optional filters so sample is scoped to state, city, or type (e.g. from state/city/type pages) */
  filter?: SampleDownloadFilters
}

/** With JS: opens modal; on submit calls gymsdata/sample-download and triggers CSV download. Without JS: link goes to sample data page. */
export function DownloadSampleButton({
  className = '',
  children,
  variant = 'primary',
  filter,
}: DownloadSampleButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successEmail, setSuccessEmail] = useState<string | null>(null)

  const handleClose = () => {
    setModalOpen(false)
    setError(null)
    setSuccessEmail(null)
  }

  const handleSubmit = async (data: DownloadSampleFormData) => {
    setError(null)
    setSuccessEmail(null)
    try {
      const { blob, filename } = await submitSampleDownload(data.name, data.email, filter)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setSuccessEmail(data.email)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Download failed. Please try again.'
      setError(message)
    }
  }

  /* Same format/style as Buy button: px-5 py-3, rounded-xl, gap-2, text-sm font-semibold */
  const baseClass =
    'inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors cursor-pointer'
  const variantClass =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
      : 'border-2 border-input bg-background hover:bg-muted hover:border-primary/40'

  return (
    <>
      <Link
        href={SAMPLE_DATA_HREF}
        className={`${baseClass} ${variantClass} ${className}`.trim()}
        aria-label="Download Free Sample (opens form)"
        onClick={(e) => {
          e.preventDefault()
          setModalOpen(true)
        }}
      >
        {children ?? (
          <>
            <Download className="h-4 w-4" aria-hidden />
            Download Free Sample
          </>
        )}
      </Link>
      <DownloadSampleModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        error={error}
        successEmail={successEmail}
      />
    </>
  )
}
