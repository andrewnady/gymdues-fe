'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ReadMoreTextProps {
  children: React.ReactNode
  className?: string
}

export function ReadMoreText({ children, className = '' }: ReadMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [canExpand, setCanExpand] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)

    const checkOverflow = () => {
      if (contentRef.current) {
        // Check if the actual content is taller than the clamped container
        const hasOverflow = contentRef.current.scrollHeight > contentRef.current.clientHeight
        setCanExpand(hasOverflow)
      }
    }

    // Small delay to ensure styles are applied
    const timer = setTimeout(checkOverflow, 100)
    window.addEventListener('resize', checkOverflow)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [children])

  return (
    <div className={className}>
      {/* 1. NO-JS FALLBACK: If JS is disabled, force the text to be full height */}
      <noscript>
        <style>{`
          .clamped-content {
            display: block !important;
            -webkit-line-clamp: none !important;
            max-height: none !important;
            overflow: visible !important;
          }
        `}</style>
      </noscript>

      <div
        ref={contentRef}
        // "clamped-content" is our target for the noscript override
        // "line-clamp-3" is the default state for everyone
        className={`clamped-content relative transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'
          }`}
        style={{
          display: isExpanded ? 'block' : '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: isExpanded ? 'none' : 3,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      {/* 2. THE BUTTON: Only show if JS is active AND content actually overflows */}
      <Button
        variant="link"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn("p-0 h-auto font-medium mt-2 text-inherit", (!isMounted || !canExpand) && 'invisible')}
        aria-expanded={isExpanded}
      >
        {isExpanded ? 'Read less' : 'Read more'}
      </Button>
    </div>
  )
}