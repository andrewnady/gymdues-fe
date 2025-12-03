'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface GymAboutSectionProps {
  description: string
}

export function GymAboutSection({ description }: GymAboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if content is long enough to need "read more"
  // This is a rough estimate - content with more than ~150 characters likely needs more than 3 lines
  const needsReadMore = description.length > 150

  return (
    <div className='space-y-2'>
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className={`text-muted-foreground leading-relaxed ${
          !isExpanded && needsReadMore ? 'line-clamp-3' : ''
        }`}
      />
      {needsReadMore && (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsExpanded(!isExpanded)}
          className='text-primary hover:text-primary/80 p-0 h-auto font-normal'
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </Button>
      )}
    </div>
  )
}

