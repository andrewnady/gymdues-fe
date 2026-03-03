'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isBestGymsSubdomain, setIsBestGymsSubdomain] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/' && !isBestGymsSubdomain

  useEffect(() => {
    setIsBestGymsSubdomain(window.location.hostname.startsWith('bestgyms.'))
  }, [])

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // On home page: transparent with white text at top, white with dark text when scrolled
  // On other pages: white background with dark text from the start
  const shouldShowWhiteText = isHomePage && !isScrolled
  const navBackground =
    isHomePage && !isScrolled
      ? 'bg-transparent backdrop-blur-sm'
      : 'bg-white/95 backdrop-blur-md shadow-md border-b'

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  const navLinks = [
    { href: `${siteUrl}/gyms`, label: 'Browse Gyms' },
    { href: process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL || `${siteUrl}/best-gyms`, label: 'Best Gyms' },
    { href: `${siteUrl}/blog`, label: 'Blog' },
    { href: `${siteUrl}/about`, label: 'About' },
    { href: `${siteUrl}/contact`, label: 'Contact' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${navBackground}`}>
      <div className='container mx-auto'>
        <div className='flex h-16 items-center justify-between px-4'>
          <Link href={`${siteUrl}/`} className='flex items-center'>
            <Image
              src='/images/logo.svg'
              alt='GymDues'
              width={104}
              height={36}
              className={`h-8 w-auto ${shouldShowWhiteText ? 'brightness-0 invert' : ''}`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-6'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-primary transition-colors ${
                  shouldShowWhiteText ? 'text-white' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              shouldShowWhiteText ? 'text-white' : 'text-foreground'
            }`}
            aria-label='Toggle menu'
          >
            {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-white border-t transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='bg-white container mx-auto px-4 py-6'>
          <nav className='flex flex-col gap-4'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-foreground hover:text-primary transition-colors py-2 text-lg font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  )
}
