import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { ReadMoreText } from '@/components/read-more-text'

export const metadata: Metadata = {
  title: 'Contact Gymdues | Questions, Updates & Partnerships',
  description:
    'Questions or found outdated pricing? Contact us to request updates, suggest a gym, or discuss partnerships and data use.',
}

export default function ContactPage() {
  return (
    <div className='min-h-screen py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold mb-4'>Contact Gymdues</h1>
            <ReadMoreText className='text-muted-foreground text-lg'>
              Have a question, found outdated pricing, or want to suggest a gym we should add?
              Contact GymDues anytime—we&apos;re happy to help. Whether it&apos;s a quick note about{' '}
              <strong>la fitness membership cost</strong>,{' '}
              <strong>anytime fitness membership cost</strong>,{' '}
              <strong>24 hour fitness membership cost</strong>, or any other membership page, your
              message helps us keep GymDues accurate and useful for everyone.
            </ReadMoreText>
          </div>

          <div className='max-w-2xl mx-auto'>
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send Gymdues a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className='space-y-4'>
                  <div className='space-y-2'>
                    <label htmlFor='name' className='text-sm font-medium'>
                      Name
                    </label>
                    <Input id='name' placeholder='Your name' required />
                  </div>
                  <div className='space-y-2'>
                    <label htmlFor='email' className='text-sm font-medium'>
                      Email
                    </label>
                    <Input id='email' type='email' placeholder='your.email@example.com' required />
                  </div>
                  <div className='space-y-2'>
                    <label htmlFor='subject' className='text-sm font-medium'>
                      Subject
                    </label>
                    <Input id='subject' placeholder="What's this about?" required />
                  </div>
                  <div className='space-y-2'>
                    <label htmlFor='message' className='text-sm font-medium'>
                      Message
                    </label>
                    <textarea
                      id='message'
                      className='flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      placeholder='Your message...'
                      required
                    />
                  </div>
                  <Button type='submit' className='w-full'>
                    <Send className='mr-2 h-4 w-4' />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
