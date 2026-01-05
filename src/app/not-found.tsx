'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Search, ArrowLeft, Book } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='flex items-center justify-center py-12 px-4'>
      <div className='max-w-2xl w-full'>
        <Card className='text-center border-none shadow-none'>
          <CardHeader className='space-y-4'>
            <div className='mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
              <span className='text-4xl font-bold text-primary'>404</span>
            </div>
            <CardTitle className='text-4xl md:text-5xl font-bold'>Page Not Found</CardTitle>
            <CardDescription className='text-lg'>
              Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <p className='text-muted-foreground'>
              Don&apos;t worry, let&apos;s get you back on track. You can browse our gyms, read our
              blog, or return to the homepage.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
              <Button asChild size='lg' className='w-full sm:w-auto'>
                <Link href='/'>
                  <Home className='mr-2 h-4 w-4' />
                  Go Home
                </Link>
              </Button>
              <Button variant='outline' asChild size='lg' className='w-full sm:w-auto'>
                <Link href='/gyms'>
                  <Search className='mr-2 h-4 w-4' />
                  Browse Gyms
                </Link>
              </Button>
              <Button variant='outline' asChild size='lg' className='w-full sm:w-auto'>
                <Link href='/blog'>
                  <Book className='mr-2 h-4 w-4' />
                  Browse Blog
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
