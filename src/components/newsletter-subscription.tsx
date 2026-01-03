'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check } from 'lucide-react';

interface NewsletterSubscriptionProps {
  variant?: 'default' | 'compact' | 'footer';
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

  if (variant === 'footer') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit}>
          <div className="relative max-w-md">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 pr-24 h-11 bg-white border border-input rounded-lg"
              disabled={isSubscribed || isLoading}
            />
            <Button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 px-4 bg-primary hover:bg-primary/90 text-white rounded-md text-sm"
              disabled={isSubscribed || isLoading}
            >
              {isSubscribed ? (
                <Check className="h-4 w-4" />
              ) : isLoading ? (
                '...'
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
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
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Form */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Subscribe Our Newsletter
          </h3>
          <p className="text-muted-foreground text-lg mb-8">
            Get important update to your email.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl p-2 shadow">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-14 text-base border-0 focus-visible:ring-0 bg-transparent"
                    disabled={isSubscribed || isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl"
                  disabled={isSubscribed || isLoading}
                >
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
            </div>
          </form>
          {isSubscribed && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-3">
              Thank you for subscribing! Check your email for confirmation.
            </p>
          )}
        </div>

        {/* Right Side - Illustration */}
        <div className="relative hidden md:block">
          <div className="relative w-full h-80">
            <Image
              src="/images/newsletter.svg"
              alt="Newsletter illustration"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 0vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

