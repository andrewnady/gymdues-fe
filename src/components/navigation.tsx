'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dumbbell } from 'lucide-react'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b'
          : 'bg-transparent backdrop-blur-sm'
      }`}
    >
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
            <span className={isScrolled ? 'text-foreground' : 'text-white'}>GymDues</span>
          </Link>
          <div className='flex items-center gap-6'>
            <Link
              href='/gyms'
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}
            >
              Browse Gyms
            </Link>
            <Link
              href='/blog'
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}
            >
              Blog
            </Link>
            <Link
              href='/about'
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}
            >
              About
            </Link>
            <Link
              href='/faqs'
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}
            >
              FAQs
            </Link>
            <Link
              href='/contact'
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}
            >
              Contact
            </Link>
            <Button asChild size='sm'>
              <Link href='/gyms'>Find a Gym</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
