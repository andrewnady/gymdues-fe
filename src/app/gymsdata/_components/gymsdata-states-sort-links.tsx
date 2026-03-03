'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

export function GymsdataStatesSortLinks() {
  const searchParams = useSearchParams()
  const sort = searchParams?.get('sort') ?? 'count'
  const isCount = sort !== 'name'

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Filter className='h-4 w-4 text-muted-foreground shrink-0' aria-hidden />
      <span className='text-sm font-medium text-muted-foreground'>Sort states by:</span>
      <div className='flex rounded-lg border border-border/80 bg-muted/30 p-0.5' role='tablist' aria-label='Sort order'>
        <Link
          href='/gymsdata/?sort=count'
          role='tab'
          aria-selected={isCount}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            isCount ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Most gyms in USA
        </Link>
        <Link
          href='/gymsdata/?sort=name'
          role='tab'
          aria-selected={!isCount}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            !isCount ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          State A–Z
        </Link>
      </div>
    </div>
  )
}
