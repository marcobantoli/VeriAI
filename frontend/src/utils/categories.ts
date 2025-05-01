import {
  Home,
  TrendingUp,
  Globe,
  Briefcase,
  Heart,
  Zap,
  Music,
} from 'lucide-react';

// Console log to check if this file is loaded properly
console.log('Loading categories...');

// Category definitions with keywords for matching
export const categories = [
  {
    id: 'home',
    name: 'Home',
    icon: Home,
    keywords: [], // All articles
  },
  {
    id: 'top-stories',
    name: 'Top Stories',
    icon: TrendingUp,
    keywords: [
      'breaking',
      'headline',
      'top',
      'trending',
      'popular',
      'important',
    ],
  },
  {
    id: 'world',
    name: 'World',
    icon: Globe,
    keywords: [
      'world',
      'global',
      'international',
      'country',
      'nation',
      'foreign',
      'europe',
      'asia',
      'africa',
      'america',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    icon: Briefcase,
    keywords: [
      'business',
      'economy',
      'market',
      'stock',
      'finance',
      'company',
      'industry',
      'corporate',
      'trade',
      'economic',
    ],
  },
  {
    id: 'health',
    name: 'Health',
    icon: Heart,
    keywords: [
      'health',
      'medical',
      'medicine',
      'disease',
      'doctor',
      'hospital',
      'patient',
      'therapy',
      'treatment',
      'wellness',
    ],
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: Zap,
    keywords: [
      'tech',
      'technology',
      'digital',
      'software',
      'hardware',
      'app',
      'computer',
      'ai',
      'robot',
      'internet',
      'cyber',
    ],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: Music,
    keywords: [
      'entertainment',
      'movie',
      'film',
      'music',
      'celebrity',
      'actor',
      'actress',
      'hollywood',
      'show',
      'tv',
      'television',
    ],
  },
];

// Helper function to categorize an article based on its content
export function categorizeArticle(
  title: string,
  description: string
): string[] {
  // Default to Home
  const articleCategories = ['home'];

  // Combine title and description for analysis
  const content = `${title} ${description}`.toLowerCase();

  // Check each category except 'home'
  categories.slice(1).forEach((category) => {
    // Check if any keywords match
    if (
      category.keywords.some((keyword) =>
        content.includes(keyword.toLowerCase())
      )
    ) {
      articleCategories.push(category.id);
    }
  });

  // If no specific categories matched, add to Top Stories
  if (articleCategories.length === 1) {
    articleCategories.push('top-stories');
  }

  return articleCategories;
}
