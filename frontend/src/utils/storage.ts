import { UserPreferences, Article, ReadingHistory, UserStats } from '../types';

const PREFERENCES_KEY = 'newsai_preferences';
const BOOKMARKS_KEY = 'newsai_bookmarks';
const HISTORY_KEY = 'newsai_history';
const STATS_KEY = 'newsai_stats';

export const storage = {
  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (!stored) {
      return {
        categories: ['Top Stories'],
        sources: [],
        updateFrequency: 'daily',
        topics: [],
        readingLevel: 'intermediate',
        darkMode: false
      };
    }
    return JSON.parse(stored);
  },

  savePreferences(preferences: UserPreferences): void {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  },

  getBookmarks(): Article[] {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveBookmark(article: Article): void {
    const bookmarks = this.getBookmarks();
    if (!bookmarks.find(b => b.id === article.id)) {
      bookmarks.push(article);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  },

  removeBookmark(articleId: string): void {
    const bookmarks = this.getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== articleId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
  },

  getReadingHistory(): ReadingHistory[] {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addToHistory(articleId: string, timeSpent: number): void {
    const history = this.getReadingHistory();
    const now = new Date();
    
    history.push({
      articleId,
      readAt: now.toISOString(),
      timeSpent
    });
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    this.updateStats(timeSpent, now);
  },

  clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  },

  getStats(): UserStats {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) {
      return {
        totalArticlesRead: 0,
        totalReadingTime: 0,
        favoriteTopics: [],
        readingStreak: 0,
        lastReadDate: new Date().toISOString()
      };
    }
    return JSON.parse(stored);
  },

  updateStats(timeSpent: number, readDate: Date): void {
    const stats = this.getStats();
    const lastRead = new Date(stats.lastReadDate);
    const dayDiff = Math.floor((readDate.getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24));

    // Update reading streak
    if (dayDiff === 1) {
      stats.readingStreak += 1;
    } else if (dayDiff > 1) {
      stats.readingStreak = 1;
    }

    stats.totalArticlesRead += 1;
    stats.totalReadingTime += timeSpent;
    stats.lastReadDate = readDate.toISOString();

    // Update favorite topics based on reading history
    const articles = this.getBookmarks();
    const topicCount = new Map<string, number>();
    articles.forEach(article => {
      article.topics.forEach(topic => {
        topicCount.set(topic, (topicCount.get(topic) || 0) + 1);
      });
    });

    stats.favoriteTopics = Array.from(topicCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }
};