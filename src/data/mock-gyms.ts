import { Gym } from '@/types/gym';

export const mockGyms: Gym[] = [
  {
    id: '1',
    slug: 'elite-fitness-center',
    name: 'Elite Fitness Center',
    description: 'A state-of-the-art fitness facility offering comprehensive training programs, modern equipment, and expert trainers. Perfect for athletes and fitness enthusiasts of all levels.',
    logo: { path: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', alt: 'Gym logo' },
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
        id: 'elite-1',
        reviewer: 'John Doe',
        rate: 5,
        text: 'Amazing facility with top-notch equipment and friendly staff! The trainers are knowledgeable and always willing to help.',
        reviewed_at: '2024-01-15',
      },
      {
        id: 'elite-2',
        reviewer: 'Jane Smith',
        rate: 4,
        text: 'Great gym, but can get crowded during peak hours. The equipment is well-maintained and the atmosphere is motivating.',
        reviewed_at: '2024-01-10',
      },
      {
        id: 'elite-3',
        reviewer: 'Michael Chen',
        rate: 5,
        text: 'Best gym in the area! Clean facilities, great variety of equipment, and excellent group classes. Highly recommend!',
        reviewed_at: '2024-01-08',
      },
      {
        id: 'elite-4',
        reviewer: 'Sarah Johnson',
        rate: 5,
        text: 'Love this place! The staff is amazing and the facilities are top-notch. Worth every penny of the membership.',
        reviewed_at: '2024-01-05',
      },
    ],
    pricing: [
      {
        id: '1',
        tier_name: 'Basic',
        price: 49.99,
        frequency: 'Monthly',
        description: 'Access to all equipment, Locker room access, Free parking',
      },
      {
        id: '2',
        tier_name: 'Premium',
        price: 79.99,
        frequency: 'Monthly',
        description: 'Everything in Basic, Personal trainer sessions, Nutrition consultation, Priority booking',
        is_popular: true,
      },
      {
        id: '3',
        tier_name: 'Annual',
        price: 799.99,
        frequency: 'Yearly',
        description: 'Everything in Premium, 2 months free, Guest passes, Exclusive events',
      },
    ],
    faqs: [
      {
        id: 'elite-reviews-1',
        question: 'How are your ratings calculated?',
        answer: 'Our 4.8 rating is based on authentic reviews from verified members. We take pride in maintaining high standards and continuously improving based on member feedback.',
        category: 'Reviews & Brand',
      },
      {
        id: 'elite-reviews-2',
        question: 'Can I leave a review after visiting?',
        answer: 'Absolutely! We encourage all members to share their experiences. Your feedback helps us improve and helps others make informed decisions.',
        category: 'Reviews & Brand',
      },
      {
        id: 'elite-fitness-1',
        question: 'What types of classes do you offer?',
        answer: 'We offer a variety of classes including yoga, pilates, spinning, HIIT, and strength training. Check our schedule for current offerings.',
        category: 'Fitness & Classes',
      },
      {
        id: 'elite-fitness-2',
        question: 'Do I need to book classes in advance?',
        answer: 'Yes, we recommend booking classes in advance through our app or website. Premium members get priority booking.',
        category: 'Fitness & Classes',
      },
      {
        id: 'elite-facilities-1',
        question: 'What are your peak hours?',
        answer: 'Peak hours are typically 6-9 AM and 5-8 PM on weekdays. We\'re open 24/7 for Premium and Annual members.',
        category: 'Facilities & Amenities',
      },
      {
        id: 'elite-facilities-2',
        question: 'Do you have parking?',
        answer: 'Yes, we have free parking available for all members. Premium members have reserved parking spots.',
        category: 'Facilities & Amenities',
      },
      {
        id: 'elite-facilities-3',
        question: 'What amenities are included?',
        answer: 'We offer locker rooms, showers, sauna, pool, juice bar, and towel service. Premium members also get access to our executive lounge.',
        category: 'Facilities & Amenities',
      },
      {
        id: 'elite-membership-1',
        question: 'Do you offer day passes?',
        answer: 'Yes, we offer day passes for $15. You can purchase them at the front desk or online.',
        category: 'Membership & Pricing',
      },
      {
        id: 'elite-membership-2',
        question: 'Can I cancel my membership anytime?',
        answer: 'Monthly memberships can be cancelled with 30 days notice. Annual memberships have a 3-month minimum commitment.',
        category: 'Membership & Pricing',
      },
      {
        id: 'elite-membership-3',
        question: 'Are there any initiation fees?',
        answer: 'Basic and Premium memberships have a $50 initiation fee. Annual memberships waive the initiation fee.',
        category: 'Membership & Pricing',
      },
      {
        id: 'elite-community-1',
        question: 'Can I bring a guest?',
        answer: 'Premium and Annual memberships include guest passes. Basic members can purchase day passes for guests.',
        category: 'Family, Corporate & Community',
      },
      {
        id: 'elite-community-2',
        question: 'Do you offer family memberships?',
        answer: 'Yes, we offer family memberships that cover up to 4 family members at a discounted rate. Contact us for pricing.',
        category: 'Family, Corporate & Community',
      },
      {
        id: 'elite-community-3',
        question: 'Do you have corporate membership programs?',
        answer: 'Yes, we offer corporate wellness programs with discounted rates for employees. Contact our corporate sales team for details.',
        category: 'Family, Corporate & Community',
      },
      {
        id: 'elite-digital-1',
        question: 'Do you have a mobile app?',
        answer: 'Yes, we have a mobile app where you can book classes, track workouts, manage your membership, and access exclusive content.',
        category: 'Digital & Online',
      },
      {
        id: 'elite-digital-2',
        question: 'Can I manage my membership online?',
        answer: 'Absolutely! You can manage your membership, update payment information, book classes, and view your workout history through our member portal or app.',
        category: 'Digital & Online',
      },
      {
        id: 'elite-digital-3',
        question: 'Do you offer virtual classes?',
        answer: 'Yes, Premium and Annual members have access to our library of on-demand virtual classes that you can stream anytime.',
        category: 'Digital & Online',
      },
    ],
    hours: [
      { day: 'Monday', from: '5:00 AM', to: '11:00 PM' },
      { day: 'Tuesday', from: '5:00 AM', to: '11:00 PM' },
      { day: 'Wednesday', from: '5:00 AM', to: '11:00 PM' },
      { day: 'Thursday', from: '5:00 AM', to: '11:00 PM' },
      { day: 'Friday', from: '5:00 AM', to: '11:00 PM' },
      { day: 'Saturday', from: '6:00 AM', to: '10:00 PM' },
      { day: 'Sunday', from: '7:00 AM', to: '9:00 PM' },
    ],
    amenities: ['24/7 Access', 'Personal Training', 'Group Classes', 'Sauna', 'Pool'],
    tags: ['Premium', '24/7', 'Pool'],
  },
  {
    id: '2',
    slug: 'power-house-gym',
    name: 'Power House Gym',
    description: 'A no-nonsense gym focused on strength training and bodybuilding. Equipped with heavy-duty machines and free weights for serious lifters.',
    logo: { path: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', alt: 'Gym logo' },
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
        id: 'powerhouse-1',
        reviewer: 'Mike Johnson',
        rate: 5,
        text: 'Best gym for serious lifters. Great equipment and atmosphere. The powerlifting area is exactly what I needed.',
        reviewed_at: '2024-01-12',
      },
      {
        id: 'powerhouse-2',
        reviewer: 'David Martinez',
        rate: 4,
        text: 'Solid gym with heavy-duty equipment. Perfect for strength training. Could use more cardio machines though.',
        reviewed_at: '2024-01-09',
      },
      {
        id: 'powerhouse-3',
        reviewer: 'Chris Wilson',
        rate: 5,
        text: 'No-nonsense gym that focuses on what matters. Great community of serious lifters. Highly recommend!',
        reviewed_at: '2024-01-07',
      },
      {
        id: 'powerhouse-4',
        reviewer: 'Alex Thompson',
        rate: 4,
        text: 'Good value for money. Equipment is well-maintained and the staff is helpful. Gets busy in the evenings.',
        reviewed_at: '2024-01-04',
      },
    ],
    pricing: [
      {
        id: '1',
        tier_name: 'Standard',
        price: 39.99,
        frequency: 'Monthly',
        description: 'Full gym access, Locker room, Shower facilities',
      },
      {
        id: '2',
        tier_name: 'Pro',
        price: 59.99,
        frequency: 'Monthly',
        description: 'Everything in Standard, Supplement discounts, Training programs',
        is_popular: true,
      },
    ],
    faqs: [
      {
        id: 'powerhouse-reviews-1',
        question: 'How are your ratings calculated?',
        answer: 'Our 4.6 rating reflects honest feedback from serious lifters and strength training enthusiasts. We value authentic reviews from our community.',
        category: 'Reviews & Brand',
      },
      {
        id: 'powerhouse-reviews-2',
        question: 'What makes Power House Gym unique?',
        answer: 'We focus exclusively on strength training and bodybuilding, providing heavy-duty equipment and a no-nonsense environment for serious lifters.',
        category: 'Reviews & Brand',
      },
      {
        id: 'powerhouse-fitness-1',
        question: 'Do you have beginner programs?',
        answer: 'Yes, we offer programs for all fitness levels, including beginners. Our trainers can help you start your strength training journey safely.',
        category: 'Fitness & Classes',
      },
      {
        id: 'powerhouse-fitness-2',
        question: 'Do you offer personal training?',
        answer: 'Yes, we have certified strength coaches available for personal training sessions. Pro members get discounted rates on training packages.',
        category: 'Fitness & Classes',
      },
      {
        id: 'powerhouse-facilities-1',
        question: 'What equipment do you have?',
        answer: 'We specialize in heavy-duty strength training equipment including powerlifting platforms, Olympic bars, power racks, and a full range of free weights and machines.',
        category: 'Facilities & Amenities',
      },
      {
        id: 'powerhouse-facilities-2',
        question: 'What are your operating hours?',
        answer: 'We\'re open Monday-Friday 6 AM - 10 PM, Saturday 7 AM - 8 PM, and Sunday 8 AM - 6 PM.',
        category: 'Facilities & Amenities',
      },
      {
        id: 'powerhouse-facilities-3',
        question: 'Do you have locker rooms?',
        answer: 'Yes, we have locker rooms with showers and secure lockers available for daily use or monthly rental.',
        category: 'Facilities & Amenities',
      },
      {
        id: 'powerhouse-membership-1',
        question: 'Do you offer monthly memberships?',
        answer: 'Yes, we offer both Standard and Pro monthly memberships. Annual memberships are also available with significant discounts.',
        category: 'Membership & Pricing',
      },
      {
        id: 'powerhouse-membership-2',
        question: 'Are there any hidden fees?',
        answer: 'No hidden fees. Our pricing is straightforward - just your monthly or annual membership fee. Locker rentals are optional.',
        category: 'Membership & Pricing',
      },
      {
        id: 'powerhouse-membership-3',
        question: 'Can I try before I commit?',
        answer: 'Yes, we offer a 3-day trial pass for $20. This gives you full access to experience our facility before committing to a membership.',
        category: 'Membership & Pricing',
      },
      {
        id: 'powerhouse-community-1',
        question: 'Do you have a community of serious lifters?',
        answer: 'Absolutely! Our gym attracts serious lifters and bodybuilders. Many members train together and support each other\'s goals.',
        category: 'Family, Corporate & Community',
      },
      {
        id: 'powerhouse-community-2',
        question: 'Can I bring a training partner?',
        answer: 'Pro members can bring a guest once per month. Standard members can purchase day passes for training partners.',
        category: 'Family, Corporate & Community',
      },
      {
        id: 'powerhouse-digital-1',
        question: 'Do you have an app for tracking workouts?',
        answer: 'Yes, Pro members get access to our app where you can log workouts, track progress, and access training programs.',
        category: 'Digital & Online',
      },
      {
        id: 'powerhouse-digital-2',
        question: 'Can I manage my membership online?',
        answer: 'Yes, you can manage your membership, update payment information, and view your account through our member portal.',
        category: 'Digital & Online',
      },
    ],
    hours: [
      { day: 'Monday', from: '6:00 AM', to: '10:00 PM' },
      { day: 'Tuesday', from: '6:00 AM', to: '10:00 PM' },
      { day: 'Wednesday', from: '6:00 AM', to: '10:00 PM' },
      { day: 'Thursday', from: '6:00 AM', to: '10:00 PM' },
      { day: 'Friday', from: '6:00 AM', to: '10:00 PM' },
      { day: 'Saturday', from: '7:00 AM', to: '8:00 PM' },
      { day: 'Sunday', from: '8:00 AM', to: '6:00 PM' },
    ],
    amenities: ['Heavy Weights', 'Powerlifting Area', 'Cardio Equipment'],
    tags: ['Strength Training', 'Bodybuilding'],
  },
  {
    id: '3',
    slug: 'zen-yoga-studio',
    name: 'Zen Yoga Studio',
    description: 'A peaceful yoga and wellness center offering various yoga classes, meditation sessions, and holistic wellness programs.',
    logo: { path: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', alt: 'Gym logo' },
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
        id: 'zen-1',
        reviewer: 'Sarah Williams',
        rate: 5,
        text: 'Perfect place to unwind and find inner peace. Excellent instructors! The meditation sessions are life-changing.',
        reviewed_at: '2024-01-14',
      },
      {
        id: 'zen-2',
        reviewer: 'Emily Davis',
        rate: 5,
        text: 'Beautiful studio with a calming atmosphere. The yoga classes are diverse and the instructors are very knowledgeable.',
        reviewed_at: '2024-01-11',
      },
      {
        id: 'zen-3',
        reviewer: 'Lisa Anderson',
        rate: 4,
        text: 'Great yoga studio! The classes are well-structured and the community is welcoming. Love the wellness workshops.',
        reviewed_at: '2024-01-06',
      },
      {
        id: 'zen-4',
        reviewer: 'Maria Garcia',
        rate: 5,
        text: 'This studio has become my sanctuary. The holistic approach to wellness is exactly what I was looking for.',
        reviewed_at: '2024-01-03',
      },
    ],
    pricing: [
      {
        id: '1',
        tier_name: 'Drop-in',
        price: 20,
        frequency: 'Single Class',
        description: 'One yoga class',
      },
      {
        id: '2',
        tier_name: 'Monthly Unlimited',
        price: 99.99,
        frequency: 'Monthly',
        description: 'Unlimited classes, Meditation sessions, Wellness workshops',
        is_popular: true,
      },
    ],
    faqs: [
      {
        id: 'zen-reviews-1',
        question: 'How are your ratings calculated?',
        answer: 'Our 4.9 rating comes from authentic reviews from our yoga and wellness community. We\'re proud of the positive impact we have on our members\' well-being.',
        category: 'Reviews & Brand',
      },
      {
        id: 'zen-reviews-2',
        question: 'What makes Zen Yoga Studio special?',
        answer: 'We focus on holistic wellness, combining yoga, meditation, and mindfulness practices in a peaceful, welcoming environment.',
        category: 'Reviews & Brand',
      },
      {
        id: 'zen-fitness-1',
        question: 'What types of yoga classes do you offer?',
        answer: 'We offer various styles including Hatha, Vinyasa, Ashtanga, Yin, and Restorative yoga. We also have meditation and mindfulness sessions.',
        category: 'Fitness & Classes',
      },
      {
        id: 'zen-fitness-2',
        question: 'Do you have classes for beginners?',
        answer: 'Yes, we have beginner-friendly classes and workshops. Our instructors are experienced in helping newcomers feel comfortable and confident.',
        category: 'Fitness & Classes',
      },
      {
        id: 'zen-fitness-3',
        question: 'How long are the classes?',
        answer: 'Most classes are 60 minutes, with some 75-minute sessions. We also offer 30-minute meditation sessions and 90-minute workshops.',
        category: 'Fitness & Classes',
      },
      {
        id: 'zen-facilities-1',
        question: 'Do I need to bring my own mat?',
        answer: 'Mats are available for rent ($2), but we recommend bringing your own for hygiene. We also have props like blocks, straps, and bolsters available.',
        category: 'Facilities & Amenities',
      },
      {
        id: 'zen-facilities-2',
        question: 'What facilities do you have?',
        answer: 'We have two spacious yoga studios, a meditation room, changing rooms, and a wellness shop with yoga accessories and supplements.',
        category: 'Facilities & Amenities',
      },
      {
        id: 'zen-membership-1',
        question: 'Can I try a class before committing?',
        answer: 'Yes, we offer a drop-in class option for $20. This allows you to experience our studio before purchasing a membership.',
        category: 'Membership & Pricing',
      },
      {
        id: 'zen-membership-2',
        question: 'What does the monthly unlimited membership include?',
        answer: 'The monthly unlimited membership includes unlimited yoga classes, meditation sessions, and access to our wellness workshops.',
        category: 'Membership & Pricing',
      },
      {
        id: 'zen-membership-3',
        question: 'Can I cancel my membership?',
        answer: 'Yes, you can cancel your monthly membership with 30 days notice. No long-term contracts required.',
        category: 'Membership & Pricing',
      },
      {
        id: 'zen-community-1',
        question: 'Do you offer family classes?',
        answer: 'Yes, we offer family yoga classes on weekends where parents and children can practice together in a fun, supportive environment.',
        category: 'Family, Corporate & Community',
      },
      {
        id: 'zen-community-2',
        question: 'Do you have corporate wellness programs?',
        answer: 'Yes, we offer corporate wellness programs including on-site classes, stress management workshops, and team-building yoga sessions.',
        category: 'Family, Corporate & Community',
      },
      {
        id: 'zen-digital-1',
        question: 'Do you offer online classes?',
        answer: 'Yes, monthly unlimited members have access to our library of on-demand yoga and meditation classes that you can stream from home.',
        category: 'Digital & Online',
      },
      {
        id: 'zen-digital-2',
        question: 'Can I book classes online?',
        answer: 'Yes, you can book classes through our website or mobile app. We recommend booking in advance as classes can fill up quickly.',
        category: 'Digital & Online',
      },
      {
        id: 'zen-digital-3',
        question: 'Do you have a mobile app?',
        answer: 'Yes, we have a mobile app where you can book classes, access on-demand content, track your practice, and manage your membership.',
        category: 'Digital & Online',
      },
    ],
    hours: [
      { day: 'Monday', from: '7:00 AM', to: '9:00 PM' },
      { day: 'Tuesday', from: '7:00 AM', to: '9:00 PM' },
      { day: 'Wednesday', from: '7:00 AM', to: '9:00 PM' },
      { day: 'Thursday', from: '7:00 AM', to: '9:00 PM' },
      { day: 'Friday', from: '7:00 AM', to: '9:00 PM' },
      { day: 'Saturday', from: '8:00 AM', to: '7:00 PM' },
      { day: 'Sunday', from: '9:00 AM', to: '6:00 PM' },
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

export interface StateWithCount {
  state: string;
  stateName: string;
  count: number;
}

export function getStatesWithCounts(): StateWithCount[] {
  const stateMap = new Map<string, number>();
  
  mockGyms.forEach((gym) => {
    const count = stateMap.get(gym.state) || 0;
    stateMap.set(gym.state, count + 1);
  });

  const stateNames: Record<string, string> = {
    'NY': 'New York',
    'CA': 'California',
    'TX': 'Texas',
    'FL': 'Florida',
    'IL': 'Illinois',
    'PA': 'Pennsylvania',
    'OH': 'Ohio',
    'GA': 'Georgia',
    'NC': 'North Carolina',
    'MI': 'Michigan',
  };

  return Array.from(stateMap.entries())
    .map(([state, count]) => ({
      state,
      stateName: stateNames[state] || state,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getTrendingGyms(limit: number = 3): Gym[] {
  // Sort by rating and review count to get trending gyms
  return [...mockGyms]
    .sort((a, b) => {
      // First sort by rating (higher is better)
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      // Then by review count (more reviews = more popular)
      return b.reviewCount - a.reviewCount;
    })
    .slice(0, limit);
}

export interface ReviewWithGym {
  id: string;
  reviewer: string;
  rate: number;
  rating: number; // Alias for rate for compatibility
  text: string;
  reviewed_at: string;
  avatar?: string;
  gymName: string;
  gymSlug: string;
}

export function getAllReviews(maxReviews: number = 12): ReviewWithGym[] {
  const allReviews: ReviewWithGym[] = [];
  
  mockGyms.forEach((gym) => {
    gym.reviews.forEach((review) => {
      allReviews.push({
        ...review,
        rating: review.rate, // Add rating alias
        gymName: gym.name,
        gymSlug: gym.slug,
      });
    });
  });
  
  // Sort by date (most recent first) and limit
  return allReviews
    .sort((a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime())
    .slice(0, maxReviews);
}

