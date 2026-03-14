import Image from 'next/image'
import { AppLink } from '@/components/app-link'
import { NewsletterSubscription } from '@/components/newsletter-subscription'

export function Footer() {
  return (
    <footer className='border-t bg-muted mt-auto'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-8'>
          <div className='md:col-span-2'>
            <AppLink href='/' className='flex items-center mb-4'>
              <Image
                src='/images/logo.svg'
                alt='GymDues'
                width={104}
                height={36}
                className='h-8 w-auto'
              />
            </AppLink>
            <p className='text-sm text-muted-foreground'>
              Find the best gym near you compare memberships, prices, and reviews in minutes.
            </p>
          </div>
          <div>
            <h3 className='font-semibold mb-4'>Explore</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <AppLink href='/gyms' className='text-muted-foreground hover:text-primary'>
                  Browse Gyms
                </AppLink>
              </li>
              <li>
                <AppLink href='/about' className='text-muted-foreground hover:text-primary'>
                  About
                </AppLink>
              </li>
              <li>
                <AppLink href='/blog' className='text-muted-foreground hover:text-primary'>
                  Blog
                </AppLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold mb-4'>Resources</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <AppLink href='/privacy-policy' className='text-muted-foreground hover:text-primary'>
                  Privacy Policy
                </AppLink>
              </li>
              <li>
                <AppLink href='/terms-of-service' className='text-muted-foreground hover:text-primary'>
                  Terms of Service
                </AppLink>
              </li>
            </ul>
          </div>
          <div className='md:col-span-2'>
            <h3 className='text-2xl font-bold mb-2 text-foreground'>
              Subscribe Gymdues Newsletter
            </h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Get gym pricing updates, deals, and new guides straight to your inbox—covering{' '}
              <strong>la fitness prices</strong>, <strong>anytime fitness prices</strong>,{' '}
              <strong>24 hour fitness prices</strong>, and more.
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
