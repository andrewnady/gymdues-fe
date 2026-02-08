'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  gymsPageFaqCategories,
  gymsPageFaqs,
  type GymsPageFAQ,
} from '@/data/gyms-page-faqs'
import { ReadMoreText } from '@/components/read-more-text'

function getFaqsByCategory(): Record<string, GymsPageFAQ[]> {
  return gymsPageFaqs.reduce<Record<string, GymsPageFAQ[]>>((acc, faq) => {
    if (!acc[faq.categoryId]) acc[faq.categoryId] = []
    acc[faq.categoryId].push(faq)
    return acc
  }, {})
}

export function GymsPageFaqSection() {
  const faqsByCategory = getFaqsByCategory()
  const firstCategoryId = gymsPageFaqCategories[0]?.id ?? 'gym_prices_fees'

  return (
    <Card className='border-none shadow-none p-0'>
      <CardHeader>
        <CardTitle className='text-center'>
          <h2 id='faq-heading' className='text-3xl md:text-4xl font-bold mb-2'>
            Frequently Asked Questions About Gym Memberships
          </h2>
          <ReadMoreText className='font-normal text-muted-foreground text-lg'>
            Common questions about gym prices, fees, plans, cancellation, guests, and how to choose
            the right gym. Use the tabs below to browse by topic.
          </ReadMoreText>
        </CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <Tabs defaultValue={firstCategoryId} className='w-full'>
          <TabsList className='flex flex-wrap w-full gap-2 mb-6 h-auto p-2 bg-transparent'>
            {gymsPageFaqCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className='text-xs md:text-sm whitespace-normal min-h-[3rem] px-4 py-2 leading-tight text-center border rounded-md data-[state=active]:bg-background data-[state=active]:border-primary data-[state=inactive]:bg-muted data-[state=inactive]:border-border'
              >
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {gymsPageFaqCategories.map((category) => {
            const faqs = faqsByCategory[category.id] ?? []
            if (faqs.length === 0) return null

            return (
              <TabsContent key={category.id} value={category.id}>
                <Card>
                  <CardContent>
                    <Accordion
                      type='single'
                      collapsible
                      className='w-full'
                      defaultValue={faqs[0]?.id}
                    >
                      {faqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className='text-lg font-semibold'>
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
