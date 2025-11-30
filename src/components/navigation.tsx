import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Dumbbell className="h-6 w-6" />
            <span>GymDues</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/gyms" className="text-sm font-medium hover:text-primary transition-colors">
              Browse Gyms
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/faqs" className="text-sm font-medium hover:text-primary transition-colors">
              FAQs
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            <Button asChild size="sm">
              <Link href="/gyms">Find a Gym</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

