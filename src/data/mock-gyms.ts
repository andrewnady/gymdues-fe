import { Gym } from '@/types/gym';

export const mockGyms: Gym[] = [
  {
    id: '1',
    slug: 'elite-fitness-center',
    name: 'Elite Fitness Center',
    description: 'A state-of-the-art fitness facility offering comprehensive training programs, modern equipment, and expert trainers. Perfect for athletes and fitness enthusiasts of all levels.',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
    featureImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '(555) 123-4567',
    email: 'info@elitefitness.com',
    website: 'https://elitefitness.com',
    rating: 4.8,
    reviewCount: 234,
    reviews: [
      {
        id: '1',
        author: 'John Doe',
        rating: 5,
        comment: 'Amazing facility with top-notch equipment and friendly staff!',
        date: '2024-01-15',
      },
      {
        id: '2',
        author: 'Jane Smith',
        rating: 4,
        comment: 'Great gym, but can get crowded during peak hours.',
        date: '2024-01-10',
      },
    ],
    plans: [
      {
        id: '1',
        name: 'Basic',
        price: 49.99,
        duration: 'Monthly',
        features: ['Access to all equipment', 'Locker room access', 'Free parking'],
      },
      {
        id: '2',
        name: 'Premium',
        price: 79.99,
        duration: 'Monthly',
        features: ['Everything in Basic', 'Personal trainer sessions', 'Nutrition consultation', 'Priority booking'],
        popular: true,
      },
      {
        id: '3',
        name: 'Annual',
        price: 799.99,
        duration: 'Yearly',
        features: ['Everything in Premium', '2 months free', 'Guest passes', 'Exclusive events'],
      },
    ],
    faqs: [
      {
        id: '1',
        question: 'Do you offer day passes?',
        answer: 'Yes, we offer day passes for $15. You can purchase them at the front desk.',
      },
      {
        id: '2',
        question: 'What are your peak hours?',
        answer: 'Peak hours are typically 6-9 AM and 5-8 PM on weekdays.',
      },
      {
        id: '3',
        question: 'Do you have parking?',
        answer: 'Yes, we have free parking available for all members.',
      },
    ],
    hours: [
      { day: 'Monday', open: '5:00 AM', close: '11:00 PM' },
      { day: 'Tuesday', open: '5:00 AM', close: '11:00 PM' },
      { day: 'Wednesday', open: '5:00 AM', close: '11:00 PM' },
      { day: 'Thursday', open: '5:00 AM', close: '11:00 PM' },
      { day: 'Friday', open: '5:00 AM', close: '11:00 PM' },
      { day: 'Saturday', open: '6:00 AM', close: '10:00 PM' },
      { day: 'Sunday', open: '7:00 AM', close: '9:00 PM' },
    ],
    amenities: ['24/7 Access', 'Personal Training', 'Group Classes', 'Sauna', 'Pool'],
    tags: ['Premium', '24/7', 'Pool'],
  },
  {
    id: '2',
    slug: 'power-house-gym',
    name: 'Power House Gym',
    description: 'A no-nonsense gym focused on strength training and bodybuilding. Equipped with heavy-duty machines and free weights for serious lifters.',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
    featureImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&h=600&fit=crop',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    phone: '(555) 234-5678',
    email: 'contact@powerhousegym.com',
    website: 'https://powerhousegym.com',
    rating: 4.6,
    reviewCount: 189,
    reviews: [
      {
        id: '1',
        author: 'Mike Johnson',
        rating: 5,
        comment: 'Best gym for serious lifters. Great equipment and atmosphere.',
        date: '2024-01-12',
      },
    ],
    plans: [
      {
        id: '1',
        name: 'Standard',
        price: 39.99,
        duration: 'Monthly',
        features: ['Full gym access', 'Locker room', 'Shower facilities'],
      },
      {
        id: '2',
        name: 'Pro',
        price: 59.99,
        duration: 'Monthly',
        features: ['Everything in Standard', 'Supplement discounts', 'Training programs'],
        popular: true,
      },
    ],
    faqs: [
      {
        id: '1',
        question: 'Do you have beginner programs?',
        answer: 'Yes, we offer programs for all fitness levels, including beginners.',
      },
    ],
    hours: [
      { day: 'Monday', open: '6:00 AM', close: '10:00 PM' },
      { day: 'Tuesday', open: '6:00 AM', close: '10:00 PM' },
      { day: 'Wednesday', open: '6:00 AM', close: '10:00 PM' },
      { day: 'Thursday', open: '6:00 AM', close: '10:00 PM' },
      { day: 'Friday', open: '6:00 AM', close: '10:00 PM' },
      { day: 'Saturday', open: '7:00 AM', close: '8:00 PM' },
      { day: 'Sunday', open: '8:00 AM', close: '6:00 PM' },
    ],
    amenities: ['Heavy Weights', 'Powerlifting Area', 'Cardio Equipment'],
    tags: ['Strength Training', 'Bodybuilding'],
  },
  {
    id: '3',
    slug: 'zen-yoga-studio',
    name: 'Zen Yoga Studio',
    description: 'A peaceful yoga and wellness center offering various yoga classes, meditation sessions, and holistic wellness programs.',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
    featureImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop',
    address: '789 Peace Lane',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    phone: '(555) 345-6789',
    email: 'hello@zenyoga.com',
    website: 'https://zenyoga.com',
    rating: 4.9,
    reviewCount: 156,
    reviews: [
      {
        id: '1',
        author: 'Sarah Williams',
        rating: 5,
        comment: 'Perfect place to unwind and find inner peace. Excellent instructors!',
        date: '2024-01-14',
      },
    ],
    plans: [
      {
        id: '1',
        name: 'Drop-in',
        price: 20,
        duration: 'Single Class',
        features: ['One yoga class'],
      },
      {
        id: '2',
        name: 'Monthly Unlimited',
        price: 99.99,
        duration: 'Monthly',
        features: ['Unlimited classes', 'Meditation sessions', 'Wellness workshops'],
        popular: true,
      },
    ],
    faqs: [
      {
        id: '1',
        question: 'Do I need to bring my own mat?',
        answer: 'Mats are available for rent, but we recommend bringing your own for hygiene.',
      },
    ],
    hours: [
      { day: 'Monday', open: '7:00 AM', close: '9:00 PM' },
      { day: 'Tuesday', open: '7:00 AM', close: '9:00 PM' },
      { day: 'Wednesday', open: '7:00 AM', close: '9:00 PM' },
      { day: 'Thursday', open: '7:00 AM', close: '9:00 PM' },
      { day: 'Friday', open: '7:00 AM', close: '9:00 PM' },
      { day: 'Saturday', open: '8:00 AM', close: '7:00 PM' },
      { day: 'Sunday', open: '9:00 AM', close: '6:00 PM' },
    ],
    amenities: ['Yoga Mats', 'Meditation Room', 'Wellness Shop'],
    tags: ['Yoga', 'Wellness', 'Meditation'],
  },
];

export function getGymBySlug(slug: string): Gym | undefined {
  return mockGyms.find((gym) => gym.slug === slug);
}

export function getAllGyms(): Gym[] {
  return mockGyms;
}

