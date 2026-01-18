'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface ReadMoreTextProps {
  children: React.ReactNode
  className?: string
}

export function ReadMoreText({ children, className = '' }: ReadMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsReadMore, setNeedsReadMore] = useState<boolean | null>(null) // null = not checked yet
  const [isMounted, setIsMounted] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const fullContentRef = useRef<HTMLDivElement>(null)

  // Track if component is mounted to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const checkOverflow = () => {
      if (contentRef.current && fullContentRef.current) {
        // Ensure the hidden element has the same width as the visible one
        const width = contentRef.current.offsetWidth
        if (width > 0) {
          fullContentRef.current.style.width = `${width}px`
        }

        // Get the full height without clamping
        const fullHeight = fullContentRef.current.scrollHeight

        // Get line height to calculate expected 2.5-line height (2 full lines + partial third)
        const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight) || 24
        const expectedHeight = lineHeight * 2.5 // Show ~2.5 lines as teaser

        // Check if content exceeds 2.5 lines
        // We use a small threshold to account for rounding
        setNeedsReadMore(fullHeight > expectedHeight + 5)
      }
    }

    // Check after a short delay to ensure DOM is rendered
    const timer = setTimeout(checkOverflow, 100)

    // Recheck on window resize
    window.addEventListener('resize', checkOverflow)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [isMounted])

  // During SSR and initial render, don't apply clamping to avoid hydration mismatch
  const shouldClamp = isMounted && !isExpanded && needsReadMore === true

  return (
    <div className={className}>
      {/* Hidden element to measure full content height - only render on client */}
      {isMounted && (
        <div
          ref={fullContentRef}
          className='invisible absolute -z-10'
          style={{
            width: contentRef.current?.offsetWidth || '100%',
          }}
        >
          {children}
        </div>
      )}

      <div className="relative">
        <div
          ref={contentRef}
          className={`${shouldClamp ? 'overflow-hidden' : ''} leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}
          style={
            shouldClamp
              ? {
                maxHeight: 'calc(2.5em * 1.5)', // Approximately 2.5 lines with 1.5 line-height
                lineHeight: '1.5em',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
              }
              : undefined
          }
          suppressHydrationWarning
        >
          {children}
        </div>
      </div>
      {isMounted && needsReadMore && (
        <Button
          variant='link'
          size='sm'
          onClick={() => setIsExpanded(!isExpanded)}
          className='text-inherit p-0 h-auto font-normal mt-2'
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </Button>
      )}
    </div>
  )
}

