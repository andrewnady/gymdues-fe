import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: '1',
    question: 'How do I find a gym near me?',
    answer: 'You can use our search feature on the homepage or browse the gyms page. You can filter by location, amenities, and other criteria to find the perfect gym for your needs.',
  },
  {
    id: '2',
    question: 'Are the gym prices accurate?',
    answer: 'We strive to keep all pricing information up to date, but prices may vary. We recommend contacting the gym directly to confirm current rates and any special offers.',
  },
  {
    id: '3',
    question: 'Can I book a tour through this website?',
    answer: 'Currently, we provide contact information for each gym. You can call or email them directly to schedule a tour or get more information about their facilities.',
  },
  {
    id: '4',
    question: 'How are gym ratings calculated?',
    answer: 'Ratings are based on reviews from verified members. Each gym\'s rating is an average of all submitted reviews, providing you with authentic feedback from real gym-goers.',
  },
  {
    id: '5',
    question: 'Do you charge a fee for using this service?',
    answer: 'No, our service is completely free for users. We help you find and compare gyms at no cost. Any fees are between you and the gym you choose to join.',
  },
  {
    id: '6',
    question: 'Can I leave a review for a gym?',
    answer: 'Yes! After visiting a gym, you can leave a review to help others make informed decisions. Reviews help build our community and provide valuable insights.',
  },
  {
    id: '7',
    question: 'What information is included in gym listings?',
    answer: 'Each gym listing includes photos, description, membership plans, operating hours, amenities, contact information, reviews, and frequently asked questions specific to that gym.',
  },
  {
    id: '8',
    question: 'How often is the gym information updated?',
    answer: 'We regularly update our database, but gym information can change. We encourage gym owners to keep their listings current, and we also update based on user feedback.',
  },
];

export default function FAQsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
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
            <CardHeader>
              <CardTitle>General Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
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

