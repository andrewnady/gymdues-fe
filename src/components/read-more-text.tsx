'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface ReadMoreTextProps {
  children: React.ReactNode
  className?: string
}

export function ReadMoreText({ children, className = '' }: ReadMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsReadMore, setNeedsReadMore] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const fullContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current && fullContentRef.current) {
        // Ensure the hidden element has the same width as the visible one
        const width = contentRef.current.offsetWidth
        if (width > 0) {
          fullContentRef.current.style.width = `${width}px`
        }
        
        // Get the full height without clamping
        const fullHeight = fullContentRef.current.scrollHeight
        
        // Get line height to calculate expected 2-line height
        const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight) || 24
        const expectedHeight = lineHeight * 2
        
        // Check if content exceeds 2 lines
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
  }, [])

  return (
    <div className={className}>
      {/* Hidden element to measure full content height */}
      <div 
        ref={fullContentRef} 
        className='invisible absolute -z-10'
        style={{ 
          width: contentRef.current?.offsetWidth || '100%',
        }}
      >
        {children}
      </div>
      
      <div
        ref={contentRef}
        className={!isExpanded && needsReadMore ? 'line-clamp-2' : ''}
      >
        {children}
      </div>
      {needsReadMore && (
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

