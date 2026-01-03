import Link from 'next/link'
import Image from 'next/image'
import { NewsletterSubscription } from '@/components/newsletter-subscription'

export function Footer() {
  return (
    <footer className='border-t bg-muted mt-auto'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-8'>
          <div className='md:col-span-2'>
            <Link href='/' className='flex items-center mb-4'>
              <Image
                src='/images/logo.svg'
                alt='GymDues'
                width={104}
                height={36}
                className='h-8 w-auto'
              />
            </Link>
            <p className='text-sm text-muted-foreground'>
              Find your perfect gym and start your fitness journey today.
            </p>
          </div>
          <div>
            <h3 className='font-semibold mb-4'>Explore</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/gyms' className='text-muted-foreground hover:text-primary'>
                  Browse Gyms
                </Link>
              </li>
              <li>
                <Link href='/about' className='text-muted-foreground hover:text-primary'>
                  About
                </Link>
              </li>
              <li>
                <Link href='/blog' className='text-muted-foreground hover:text-primary'>
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold mb-4'>Resources</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='#' className='text-muted-foreground hover:text-primary'>
                  How It Works
                </a>
              </li>
              <li>
                <a href='#' className='text-muted-foreground hover:text-primary'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#' className='text-muted-foreground hover:text-primary'>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div className='md:col-span-2'>
            <h3 className='text-2xl font-bold mb-2 text-foreground'>Subscribe Our Newsletter</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Get important update to your email.
            </p>
            <NewsletterSubscription variant='footer' />
          </div>
        </div>
        <div className='mt-8 pt-8 border-t text-center text-sm text-muted-foreground'>
          <p>&copy; {new Date().getFullYear()} GymDues. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
