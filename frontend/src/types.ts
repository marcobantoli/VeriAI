export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  readingTime?: number;
  topics: string[];
}

export interface UserPreferences {
  categories: string[];
  sources: string[];
  updateFrequency: 'realtime' | 'daily' | 'weekly';
  topics: string[];
  readingLevel: 'basic' | 'intermediate' | 'advanced';
  darkMode: boolean;
}

export interface ReadingHistory {
  articleId: string;
  readAt: string;
  timeSpent: number;
}

export interface UserStats {
  totalArticlesRead: number;
  totalReadingTime: number;
  favoriteTopics: string[];
  readingStreak: number;
  lastReadDate: string;
}