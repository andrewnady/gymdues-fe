import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle } from 'lucide-react';
import { faqsByCategory, faqCategories } from '@/data/faqs';

export default function FAQsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about using GymDues
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue={faqCategories[0].title} className="w-full">
                <TabsList className="flex flex-wrap w-full gap-2 mb-6 h-auto p-2 bg-transparent">
                  {faqCategories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.title} 
                      className="text-xs md:text-sm whitespace-normal min-h-[3rem] px-4 py-2 leading-tight text-center border rounded-md data-[state=active]:bg-background data-[state=active]:border-primary data-[state=inactive]:bg-muted data-[state=inactive]:border-border"
                    >
                      {category.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {faqCategories.map((category) => (
                  <TabsContent key={category.id} value={category.title}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{category.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion 
                          type="single" 
                          collapsible 
                          className="w-full"
                          defaultValue={faqsByCategory[category.title][0]?.id}
                        >
                          {faqsByCategory[category.title].map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                              <AccordionTrigger>{faq.question}</AccordionTrigger>
                              <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We&apos;re here to help!
            </p>
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact Us →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
