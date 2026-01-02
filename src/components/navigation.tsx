'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dumbbell } from 'lucide-react'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // On home page: transparent with white text at top, white with dark text when scrolled
  // On other pages: white background with dark text from the start
  const shouldShowWhiteText = isHomePage && !isScrolled
  const navBackground = isHomePage && !isScrolled 
    ? 'bg-transparent backdrop-blur-sm' 
    : 'bg-white/95 backdrop-blur-md shadow-md border-b'

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${navBackground}`}
    >
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
            <Dumbbell className='h-6 w-6' />
            <span className={shouldShowWhiteText ? 'text-white' : 'text-foreground'}>GymDues</span>
          </Link>
          <div className='flex items-center gap-6'>
            <Link
              href='/gyms'
              className={`text-sm font-medium hover:text-primary transition-colors ${
                shouldShowWhiteText ? 'text-white' : 'text-foreground'
              }`}
            >
              Browse Gyms
            </Link>
            <Link
              href='/blog'
              className={`text-sm font-medium hover:text-primary transition-colors ${
                shouldShowWhiteText ? 'text-white' : 'text-foreground'
              }`}
            >
              Blog
            </Link>
            <Link
              href='/about'
              className={`text-sm font-medium hover:text-primary transition-colors ${
                shouldShowWhiteText ? 'text-white' : 'text-foreground'
              }`}
            >
              About
            </Link>
            <Link
              href='/faqs'
              className={`text-sm font-medium hover:text-primary transition-colors ${
                shouldShowWhiteText ? 'text-white' : 'text-foreground'
              }`}
            >
              FAQs
            </Link>
            <Link
              href='/contact'
              className={`text-sm font-medium hover:text-primary transition-colors ${
                shouldShowWhiteText ? 'text-white' : 'text-foreground'
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
