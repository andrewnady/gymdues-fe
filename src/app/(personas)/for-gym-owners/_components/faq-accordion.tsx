'use client'

import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/**
 * Renders the FAQ accordion only after mount to avoid Radix ID hydration mismatch
 * (server and client generate different aria-controls/id values).
 */
export function FaqAccordion() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className='mt-4 border rounded-xl overflow-hidden'>
        <div className='border-b px-4 py-4 text-sm'>
          <p className='font-medium'>
            Is it really free to claim my gym?
          </p>
          <p className='mt-1 text-muted-foreground'>
            Yes. Claiming your gym and managing your basic listing is completely free. You can
            update your info, respond to reviews, and see basic analytics without paying. Premium
            tools are optional.
          </p>
        </div>
        <div className='border-b px-4 py-4 text-sm'>
          <p className='font-medium'>
            What if someone already claimed my gym?
          </p>
          <p className='mt-1 text-muted-foreground'>
            If you believe your gym has been claimed by someone who isn&apos;t authorized, you can
            request an ownership review during the claim process. Our team will verify
            documentation and help transfer the listing to the rightful owner.
          </p>
        </div>
        <div className='border-b px-4 py-4 text-sm'>
          <p className='font-medium'>
            How long does verification take?
          </p>
          <p className='mt-1 text-muted-foreground'>
            For most owners, verification is instant or completed within a few minutes via email or
            phone. In some cases, it may take up to 1–2 business days if additional documents are
            needed.
          </p>
        </div>
        <div className='border-b px-4 py-4 text-sm'>
          <p className='font-medium'>
            Do I need a credit card to get started?
          </p>
          <p className='mt-1 text-muted-foreground'>
            No. You can claim your gym and use the free tools without entering any payment
            details. You&apos;ll only add a card if you choose to upgrade to Premium.
          </p>
        </div>
        <div className='px-4 py-4 text-sm'>
          <p className='font-medium'>
            Can I manage more than one location?
          </p>
          <p className='mt-1 text-muted-foreground'>
            Yes. You can claim and manage multiple locations from the same account. Premium
            includes tools designed for franchises and chains.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Accordion type='single' collapsible className='mt-4 border rounded-xl'>
      <AccordionItem value='free'>
        <AccordionTrigger className='px-4'>
          Is it really free to claim my gym?
        </AccordionTrigger>
        <AccordionContent className='px-4'>
          <p className='text-sm text-muted-foreground'>
            Yes. Claiming your gym and managing your basic listing is
            completely free. You can update your info, respond to reviews,
            and see basic analytics without paying. Premium tools are
            optional and can be added later if you want more growth
            features.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='already-claimed'>
        <AccordionTrigger className='px-4'>
          What if someone already claimed my gym?
        </AccordionTrigger>
        <AccordionContent className='px-4'>
          <p className='text-sm text-muted-foreground'>
            If you believe your gym has been claimed by someone who isn&apos;t
            authorized, you can request an ownership review during the
            claim process. Our team will verify documentation and help
            transfer the listing to the rightful owner.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='verification-time'>
        <AccordionTrigger className='px-4'>
          How long does verification take?
        </AccordionTrigger>
        <AccordionContent className='px-4'>
          <p className='text-sm text-muted-foreground'>
            For most owners, verification is instant or completed within a
            few minutes via email or phone. In cases where we need
            additional documents, it may take up to 1–2 business days.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='payment'>
        <AccordionTrigger className='px-4'>
          Do I need a credit card to get started?
        </AccordionTrigger>
        <AccordionContent className='px-4'>
          <p className='text-sm text-muted-foreground'>
            No. You can claim your gym and use the free tools without
            entering any payment details. You&apos;ll only add a card if
            you choose to upgrade to Premium.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='multi-location'>
        <AccordionTrigger className='px-4'>
          Can I manage more than one location?
        </AccordionTrigger>
        <AccordionContent className='px-4'>
          <p className='text-sm text-muted-foreground'>
            Yes. You can claim and manage multiple locations from the same
            account. Premium includes tools designed
            for franchises and chains.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
