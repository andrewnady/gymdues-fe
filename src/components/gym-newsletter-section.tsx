'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Check } from 'lucide-react';

export function GymNewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');

    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubscribed(false);
    }, 5000);
  };

  return (
    <Card className="mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Subscribe for Gym Deals & Updates</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of fitness enthusiasts who get the latest gym promotions, membership tips, and exclusive savings sent to their inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              disabled={isSubscribed || isLoading}
            />
            <Button type="submit" size="lg" disabled={isSubscribed || isLoading}>
              {isSubscribed ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Subscribed!
                </>
              ) : isLoading ? (
                'Subscribing...'
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
          {isSubscribed && (
            <p className="text-sm text-green-600 dark:text-green-400 mb-3 text-center">
              Thank you for subscribing! Check your email for confirmation.
            </p>
          )}
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

