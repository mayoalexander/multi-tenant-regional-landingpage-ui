export interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  text: string
  serviceType: string
  date: string
  verified: boolean
}

export interface Article {
  id: string
  title: string
  excerpt: string
  category: 'security-tips' | 'local-news' | 'product-updates' | 'safety-guides'
  readTime: number
  publishedAt: string
  imageUrl: string
  localArea?: string[]
}

export interface LocalFeature {
  id: string
  name: string
  type: 'restaurant' | 'attraction' | 'business' | 'event'
  description: string
  address: string
  rating: number
  securityTip: string
  imageUrl: string
  zipCodes: string[]
}

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sarah Mitchell',
    location: 'Charlotte, NC',
    rating: 5,
    text: 'SafeHaven installed our system last month and we already feel so much safer. The mobile app is incredible - I can check on my home from anywhere!',
    serviceType: 'Home Security System',
    date: '2024-12-15',
    verified: true
  },
  {
    id: 'test-2', 
    name: 'Michael Rodriguez',
    location: 'Atlanta, GA',
    rating: 5,
    text: 'TopSecurity responded to our alarm in under 3 minutes. The monitoring team was professional and the police were dispatched immediately. Worth every penny!',
    serviceType: 'Professional Monitoring',
    date: '2024-12-10',
    verified: true
  },
  {
    id: 'test-3',
    name: 'Jennifer Park',
    location: 'Nashville, TN',
    rating: 4,
    text: 'The smart home integration is amazing. I can control lights, locks, and cameras all from one app. Installation was quick and the techs were very professional.',
    serviceType: 'Smart Home Automation',
    date: '2024-12-08',
    verified: true
  },
  {
    id: 'test-4',
    name: 'David Thompson',
    location: 'Tampa, FL',
    rating: 5,
    text: 'BestSecurity saved us during Hurricane season. When power went out, our system stayed online and we could monitor everything remotely. Highly recommend!',
    serviceType: 'Business Security',
    date: '2024-12-05',
    verified: true
  },
  {
    id: 'test-5',
    name: 'Lisa Chen',
    location: 'Birmingham, AL',
    rating: 5,
    text: 'RedHawk Alarms has been protecting our family for 2 years. The customer service is exceptional and the technology keeps getting better with updates.',
    serviceType: 'Video Surveillance',
    date: '2024-12-01',
    verified: true
  }
]

export const articles: Article[] = [
  {
    id: 'art-1',
    title: '5 Winter Security Tips for Southeast Homeowners',
    excerpt: 'Cold weather brings unique security challenges. Learn how to protect your home during the winter months with these expert tips.',
    category: 'security-tips',
    readTime: 4,
    publishedAt: '2024-12-18',
    imageUrl: '/api/placeholder/300/200',
    localArea: ['NC', 'SC', 'TN', 'GA', 'AL']
  },
  {
    id: 'art-2',
    title: 'Hurricane Preparedness: Securing Your Smart Home',
    excerpt: 'Florida hurricane season requires special preparation. Discover how modern security systems can protect you before, during, and after storms.',
    category: 'safety-guides',
    readTime: 6,
    publishedAt: '2024-12-15',
    imageUrl: '/api/placeholder/300/200',
    localArea: ['FL']
  },
  {
    id: 'art-3',
    title: 'Charlotte Crime Statistics: What Homeowners Need to Know',
    excerpt: 'Recent data shows changing crime patterns in Charlotte metro. Learn which neighborhoods are most affected and how to stay protected.',
    category: 'local-news',
    readTime: 5,
    publishedAt: '2024-12-12',
    imageUrl: '/api/placeholder/300/200',
    localArea: ['NC']
  },
  {
    id: 'art-4',
    title: 'New AI-Powered Camera Features Now Available',
    excerpt: 'Our latest software update includes advanced person detection, package alerts, and improved night vision capabilities.',
    category: 'product-updates',
    readTime: 3,
    publishedAt: '2024-12-10',
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: 'art-5',
    title: 'Holiday Travel Security Checklist',
    excerpt: 'Traveling for the holidays? Use this comprehensive checklist to secure your home before you leave and monitor it while you\'re away.',
    category: 'security-tips',
    readTime: 4,
    publishedAt: '2024-12-08',
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: 'art-6',
    title: 'Atlanta Business District Security Upgrades',
    excerpt: 'Major Atlanta businesses are investing in advanced security systems. See what features are becoming standard in commercial properties.',
    category: 'local-news',
    readTime: 5,
    publishedAt: '2024-12-05',
    imageUrl: '/api/placeholder/300/200',
    localArea: ['GA']
  }
]

export const localFeatures: LocalFeature[] = [
  {
    id: 'loc-1',
    name: 'NASCAR Hall of Fame',
    type: 'attraction',
    description: 'Interactive motorsports entertainment experience in uptown Charlotte',
    address: '400 E M.L.K. Jr Blvd, Charlotte, NC',
    rating: 4.5,
    securityTip: 'Popular tourist areas like this attract both visitors and opportunistic criminals. Ensure your home security is active when visiting busy attractions.',
    imageUrl: '/api/placeholder/300/200',
    zipCodes: ['28202', '28203', '28204']
  },
  {
    id: 'loc-2',
    name: 'Atlanta BeltLine',
    type: 'attraction',
    description: 'Popular trail system connecting neighborhoods and parks',
    address: 'Various locations, Atlanta, GA',
    rating: 4.7,
    securityTip: 'When enjoying outdoor activities, remember that vacant homes are targets. Consider smart locks and automated lighting to simulate occupancy.',
    imageUrl: '/api/placeholder/300/200',
    zipCodes: ['30309', '30312', '30313']
  },
  {
    id: 'loc-3',
    name: 'Broadway District',
    type: 'attraction',
    description: 'Nashville\'s famous entertainment district with live music venues',
    address: 'Broadway, Nashville, TN',
    rating: 4.6,
    securityTip: 'Late night entertainment areas can see increased activity. Security cameras with night vision help monitor your property during evening hours.',
    imageUrl: '/api/placeholder/300/200',
    zipCodes: ['37203', '37201', '37219']
  },
  {
    id: 'loc-4',
    name: 'South Beach',
    type: 'attraction', 
    description: 'World-famous beach destination with art deco architecture',
    address: 'Miami Beach, FL',
    rating: 4.4,
    securityTip: 'High-traffic tourist areas require extra vigilance. Motion sensors and door/window contacts provide comprehensive coverage while you explore.',
    imageUrl: '/api/placeholder/300/200',
    zipCodes: ['33139', '33140', '33141']
  },
  {
    id: 'loc-5',
    name: 'Birmingham Civil Rights Institute',
    type: 'attraction',
    description: 'Museum and research center chronicling the American Civil Rights Movement',
    address: '520 16th St N, Birmingham, AL',
    rating: 4.8,
    securityTip: 'Cultural institutions often have enhanced security. Learn from their example by layering multiple security technologies for maximum protection.',
    imageUrl: '/api/placeholder/300/200',
    zipCodes: ['35203', '35204', '35205']
  },
  {
    id: 'loc-6',
    name: 'Falls Park on the Reedy',
    type: 'attraction',
    description: 'Scenic downtown park with waterfalls and walking trails',
    address: '601 S Main St, Greenville, SC',
    rating: 4.9,
    securityTip: 'Parks and recreational areas are great for community activities. Neighborhood watch programs combined with home security create safer communities.',
    imageUrl: '/api/placeholder/300/200',
    zipCodes: ['29601', '29602', '29605']
  }
]