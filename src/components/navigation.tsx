'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'
import { getAuthToken, clearAuthToken, apiLogout } from '@/lib/gym-owner-auth'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isBestGymsSubdomain, setIsBestGymsSubdomain] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isGymsdataSubdomain, setIsGymsdataSubdomain] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/' && !isBestGymsSubdomain

  useEffect(() => {
    const hostname = window.location.hostname
    setIsBestGymsSubdomain(hostname.startsWith('bestgyms.'))
    setIsGymsdataSubdomain(hostname.startsWith('gymsdata.'))
    setIsAuthenticated(!!getAuthToken())
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu and dropdown when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsDropdownOpen(false)
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-dropdown]')) setIsDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isDropdownOpen])

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

  // On gymsdata subdomain (production): always solid white header so it's visible on white page
  // On home page: transparent with white text at top, solid with dark text when scrolled
  // On other pages: white background with dark text from the start
  const useSolidHeader = isGymsdataSubdomain || (isHomePage && isScrolled) || !isHomePage
  const shouldShowWhiteText = isHomePage && !isScrolled && !isGymsdataSubdomain
  const navBackground = useSolidHeader
    ? 'bg-white/95 backdrop-blur-md shadow-md border-b'
    : 'bg-transparent backdrop-blur-sm'

  const handleLogout = async () => {
    const token = getAuthToken()
    if (token) await apiLogout(token)
    clearAuthToken()
    setIsAuthenticated(false)
    router.push(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/dashboard/auth/login`)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  const navLinks = [
    { href: `${siteUrl}/gyms`, label: 'Browse Gyms' },
    { href: process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL || `${siteUrl}/best-gyms`, label: 'Best Gyms' },
    { href: process.env.NEXT_PUBLIC_GYMSDATA_BASE_URL || `${siteUrl}/gymsdata`, label: 'Dataset' },
    { href: `${siteUrl}/blog`, label: 'Blog' },
    { href: `${siteUrl}/about`, label: 'About' },
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
            {isAuthenticated ? (
              <div className='relative' data-dropdown>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 text-sm font-medium border rounded-md px-3 py-1.5 transition-colors ${
                    shouldShowWhiteText
                      ? 'border-white/60 text-white hover:bg-white/10'
                      : 'border-input text-foreground hover:bg-accent'
                  }`}
                >
                  My Account
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-lg z-50'>
                    <Link
                      href={`${siteUrl}/dashboard`}
                      onClick={() => setIsDropdownOpen(false)}
                      className='flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors'
                    >
                      <LayoutDashboard className='h-4 w-4' />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { setIsDropdownOpen(false); handleLogout() }}
                      className='flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors border-t'
                    >
                      <LogOut className='h-4 w-4' />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`${siteUrl}/dashboard/auth/login`}
                className={`hidden text-sm font-medium border rounded-md px-3 py-1.5 transition-colors ${
                  shouldShowWhiteText
                    ? 'border-white/60 text-white hover:bg-white/10'
                    : 'border-input text-foreground hover:bg-accent'
                }`}
              >
                Gym Owner Login
              </Link>
            )}
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
            <div className='border-t pt-4 flex flex-col gap-2'>
              {isAuthenticated ? (
                <>
                  <Link
                    href={`${siteUrl}/dashboard`}
                    className='flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2 text-lg font-medium'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className='h-5 w-5' />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout() }}
                    className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2 text-lg font-medium text-left'
                  >
                    <LogOut className='h-5 w-5' />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href={`${siteUrl}/dashboard/auth/login`}
                  className='hidden text-foreground hover:text-primary transition-colors py-2 text-lg font-medium'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Gym Owner Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </nav>
  )
}
