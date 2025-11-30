export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string; // e.g., "Monthly", "3 Months", "Yearly"
  features: string[];
  popular?: boolean;
}

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface GymFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Gym {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  featureImage: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  plans: Plan[];
  faqs: GymFAQ[];
  hours: OperatingHours[];
  amenities?: string[];
  tags?: string[];
}

