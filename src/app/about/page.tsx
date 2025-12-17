import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About GymDues</h1>
            <p className="text-muted-foreground text-lg">
              Your trusted partner in finding the perfect fitness center
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At GymDues, we believe that everyone deserves access to quality fitness facilities that match their goals, budget, and lifestyle. Our mission is to simplify the process of finding and choosing the right gym by providing comprehensive, up-to-date information about fitness centers in your area.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We&apos;re committed to helping you make informed decisions through detailed listings, authentic reviews, and transparent pricing information. Whether you&apos;re a fitness enthusiast, a beginner starting your journey, or someone looking to switch gyms, we&apos;re here to help you find your perfect fit.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To become the most trusted platform for gym discovery, helping millions of people find their ideal fitness home and achieve their health goals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Transparency, authenticity, and user-first approach. We believe in honest reviews, accurate information, and putting your fitness journey first.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
              <CardDescription>Everything you need to find your perfect gym</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Comprehensive Listings</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed information about facilities, amenities, and membership plans
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Authentic Reviews</h3>
                    <p className="text-sm text-muted-foreground">
                      Real feedback from verified members to help you make informed decisions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Easy Comparison</h3>
                    <p className="text-sm text-muted-foreground">
                      Compare prices, features, and amenities side-by-side
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Free Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Our service is completely free for users - no hidden fees or charges
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

