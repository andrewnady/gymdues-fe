'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReadMoreText } from '@/components/read-more-text'
import { bestGymsFaqs } from '@/data/best-gyms-faqs'

interface BestGymsFaqSectionProps {
  location: string
}

function replaceLocation(text: string, location: string) {
  return text.replace(/\{location\}/g, location)
}

export function BestGymsFaqSection({ location }: BestGymsFaqSectionProps) {
  return (
    <Card className='border-none shadow-none p-0'>
      <CardHeader>
        <CardTitle className='text-center'>
          <h2 id='faq-heading' className='text-3xl md:text-4xl font-bold mb-2'>
            Frequently Asked Questions about Gyms in {location}
          </h2>
          <ReadMoreText className='font-normal text-muted-foreground text-lg'>
            Common questions about gym memberships, pricing, and fitness options in {location}. Browse
            the questions below to learn more about finding the right gym.
          </ReadMoreText>
        </CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <Card>
          <CardContent>
            <Accordion
              type='single'
              collapsible
              className='w-full'
              defaultValue={bestGymsFaqs[0]?.id}
            >
              {bestGymsFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className='text-lg font-semibold'>
                    {replaceLocation(faq.question, location)}
                  </AccordionTrigger>
                  <AccordionContent>
                    {replaceLocation(faq.answer, location)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
