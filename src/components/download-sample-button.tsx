'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { DownloadSampleModal, type DownloadSampleFormData } from './download-sample-modal'

const ALERT_MESSAGE = 'Download is not available right now.'

interface DownloadSampleButtonProps {
  className?: string
  children?: React.ReactNode
  /** Optional variant: 'primary' (default) or 'outline' */
  variant?: 'primary' | 'outline'
}

export function DownloadSampleButton({
  className = '',
  children,
  variant = 'primary',
}: DownloadSampleButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleSubmit = (_data: DownloadSampleFormData) => {
    // In production: send data to API, then trigger download or email
    if (typeof window !== 'undefined') {
      window.alert(ALERT_MESSAGE)
    }
  }

  const baseClass =
    'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer'
  const variantClass =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'border-2 border-input bg-background hover:bg-muted'

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`${baseClass} ${variantClass} ${className}`.trim()}
        aria-label="Download sample"
        aria-haspopup="dialog"
      >
        {children ?? (
          <>
            <Download className="h-4 w-4" aria-hidden />
            Download sample
          </>
        )}
      </button>
      <DownloadSampleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}
