'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check } from 'lucide-react';

interface NewsletterSubscriptionProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function NewsletterSubscription({ variant = 'default', className }: NewsletterSubscriptionProps) {
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

  if (variant === 'compact') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
            disabled={isSubscribed || isLoading}
          />
          <Button type="submit" disabled={isSubscribed || isLoading}>
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
        </form>
        {isSubscribed && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            Thank you for subscribing! Check your email for confirmation.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-muted-foreground">
          Get the latest fitness tips, gym updates, and exclusive offers delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
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
          <p className="text-sm text-green-600 dark:text-green-400 mt-3 text-center">
            Thank you for subscribing! Check your email for confirmation.
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-3 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}

