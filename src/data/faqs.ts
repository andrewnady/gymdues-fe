export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const faqsByCategory: Record<string, FAQ[]> = {
  'Reviews & Brand': [
    {
      id: 'reviews-1',
      question: 'How are gym ratings calculated?',
      answer: 'Ratings are based on reviews from verified members. Each gym\'s rating is an average of all submitted reviews, providing you with authentic feedback from real gym-goers.',
    },
    {
      id: 'reviews-2',
      question: 'Can I leave a review for a gym?',
      answer: 'Yes! After visiting a gym, you can leave a review to help others make informed decisions. Reviews help build our community and provide valuable insights.',
    },
    {
      id: 'reviews-3',
      question: 'How do I know if a review is authentic?',
      answer: 'We verify reviews through multiple methods including member verification, visit confirmation, and automated fraud detection to ensure authenticity.',
    },
    {
      id: 'reviews-4',
      question: 'Can gyms respond to reviews?',
      answer: 'Yes, gym owners can respond to reviews to address concerns, thank members, or provide additional information. This helps create transparency and better communication.',
    },
    {
      id: 'reviews-5',
      question: 'What makes GymDues different from other platforms?',
      answer: 'GymDues focuses specifically on fitness centers, providing detailed information, authentic reviews, and comprehensive comparison tools to help you find the perfect gym for your needs.',
    },
  ],
  'Fitness & Classes': [
    {
      id: 'fitness-1',
      question: 'What types of fitness classes are available at gyms?',
      answer: 'Gyms offer a wide variety of classes including yoga, pilates, spinning, HIIT, strength training, dance, martial arts, and more. Each gym listing shows available classes.',
    },
    {
      id: 'fitness-2',
      question: 'Do I need to book classes in advance?',
      answer: 'This varies by gym. Some gyms require advance booking, while others allow walk-ins. Check the individual gym listing or contact them directly for their class booking policy.',
    },
    {
      id: 'fitness-3',
      question: 'Are personal training sessions included in membership?',
      answer: 'Most basic memberships don\'t include personal training, but many gyms offer it as an add-on service. Premium memberships often include a certain number of sessions. Check each gym\'s plan details.',
    },
    {
      id: 'fitness-4',
      question: 'What equipment can I expect to find at most gyms?',
      answer: 'Most gyms include cardio equipment (treadmills, ellipticals, bikes), free weights, weight machines, and functional training areas. Premium gyms may also have specialized equipment.',
    },
    {
      id: 'fitness-5',
      question: 'Can beginners join any gym?',
      answer: 'Absolutely! Most gyms welcome beginners and offer orientation sessions, beginner-friendly classes, and staff assistance. Look for gyms that specifically mention beginner programs.',
    },
  ],
  'Facilities & Amenities': [
    {
      id: 'facilities-1',
      question: 'What amenities should I look for in a gym?',
      answer: 'Common amenities include locker rooms, showers, parking, towel service, sauna, pool, juice bar, and childcare. Consider which amenities are important for your fitness routine.',
    },
    {
      id: 'facilities-2',
      question: 'Do all gyms have parking?',
      answer: 'Not all gyms have parking, especially in urban areas. Check the gym listing for parking information, or look for gyms near public transportation if parking isn\'t available.',
    },
    {
      id: 'facilities-3',
      question: 'Are locker rooms and showers available?',
      answer: 'Most gyms provide locker rooms and showers, but it\'s always best to confirm. Some smaller or specialized facilities may have limited amenities.',
    },
    {
      id: 'facilities-4',
      question: 'Can I use the gym facilities without a membership?',
      answer: 'Many gyms offer day passes or trial periods. Check individual gym listings for day pass availability and pricing. Some gyms also offer guest passes for members.',
    },
    {
      id: 'facilities-5',
      question: 'What are peak hours at most gyms?',
      answer: 'Peak hours are typically early morning (6-9 AM) and evening (5-8 PM) on weekdays. Weekends are usually less crowded. Each gym listing shows their operating hours.',
    },
  ],
  'Membership & Pricing': [
    {
      id: 'membership-1',
      question: 'Are the gym prices accurate?',
      answer: 'We strive to keep all pricing information up to date, but prices may vary. We recommend contacting the gym directly to confirm current rates and any special offers.',
    },
    {
      id: 'membership-2',
      question: 'Do you charge a fee for using this service?',
      answer: 'No, our service is completely free for users. We help you find and compare gyms at no cost. Any fees are between you and the gym you choose to join.',
    },
    {
      id: 'membership-3',
      question: 'What types of membership plans are available?',
      answer: 'Common plans include monthly, quarterly, annual, and pay-as-you-go options. Some gyms also offer student, senior, or corporate discounts. Check each gym\'s listing for specific plans.',
    },
    {
      id: 'membership-4',
      question: 'Can I cancel my membership anytime?',
      answer: 'Cancellation policies vary by gym. Some offer month-to-month memberships with easy cancellation, while others may require longer commitments. Always read the contract terms carefully.',
    },
    {
      id: 'membership-5',
      question: 'Are there any hidden fees?',
      answer: 'Some gyms charge initiation fees, annual fees, or cancellation fees. These should be disclosed in the membership details. We recommend asking about all fees before signing up.',
    },
    {
      id: 'membership-6',
      question: 'Do gyms offer trial periods?',
      answer: 'Many gyms offer free trial periods ranging from one day to one week. This allows you to experience the facility before committing to a membership.',
    },
  ],
  'Family, Corporate & Community': [
    {
      id: 'community-1',
      question: 'Do gyms offer family memberships?',
      answer: 'Yes, many gyms offer family or household memberships at discounted rates. These typically cover 2-4 family members and can provide significant savings.',
    },
    {
      id: 'community-2',
      question: 'Are there gyms with childcare facilities?',
      answer: 'Some gyms offer childcare or kids\' clubs, allowing parents to work out while their children are supervised. Check the amenities section of each gym listing.',
    },
    {
      id: 'community-3',
      question: 'Do gyms offer corporate memberships?',
      answer: 'Many gyms offer corporate membership programs with discounted rates for employees. These programs can be arranged directly with the gym or through corporate wellness programs.',
    },
    {
      id: 'community-4',
      question: 'Can I bring a guest to the gym?',
      answer: 'Guest policies vary by gym. Some include guest passes with membership, while others charge a daily fee. Premium memberships often include more guest privileges.',
    },
    {
      id: 'community-5',
      question: 'Are there community events at gyms?',
      answer: 'Many gyms host community events, challenges, workshops, and social gatherings. Check individual gym listings or their social media for upcoming events.',
    },
  ],
  'Digital & Online': [
    {
      id: 'digital-1',
      question: 'Can I book a tour through this website?',
      answer: 'Currently, we provide contact information for each gym. You can call or email them directly to schedule a tour or get more information about their facilities.',
    },
    {
      id: 'digital-2',
      question: 'How often is the gym information updated?',
      answer: 'We regularly update our database, but gym information can change. We encourage gym owners to keep their listings current, and we also update based on user feedback.',
    },
    {
      id: 'digital-3',
      question: 'Do gyms offer virtual or online classes?',
      answer: 'Many gyms now offer virtual classes and online training programs, especially since the pandemic. Check individual gym listings for digital offerings.',
    },
    {
      id: 'digital-4',
      question: 'Can I manage my membership online?',
      answer: 'Most modern gyms offer online member portals where you can manage your account, book classes, track workouts, and update payment information.',
    },
    {
      id: 'digital-5',
      question: 'Is there a mobile app for GymDues?',
      answer: 'Currently, GymDues is optimized for mobile browsers. We\'re working on a dedicated mobile app to enhance your experience. Stay tuned for updates!',
    },
    {
      id: 'digital-6',
      question: 'How do I update my account information?',
      answer: 'You can update your account information through your profile settings. If you need to change gym-related information, contact the gym directly or reach out to our support team.',
    },
  ],
};

export const faqCategories = [
  'Reviews & Brand',
  'Fitness & Classes',
  'Facilities & Amenities',
  'Membership & Pricing',
  'Family, Corporate & Community',
  'Digital & Online',
];

