import React from 'react';
import { Trophy, Clock, BookOpen, Flame, Hash } from 'lucide-react';
import { storage } from '../utils/storage';
import { format } from 'date-fns';

export const UserDashboard: React.FC = () => {
  const stats = storage.getStats();
  const readingHistory = storage.getReadingHistory();
  const preferences = storage.getPreferences();

  const formatReadingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Reading Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Articles Read</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalArticlesRead}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Reading Time</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {formatReadingTime(stats.totalReadingTime)}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="text-orange-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Reading Streak</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.readingStreak} days</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Reading Level</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 capitalize">
            {preferences.readingLevel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Hash className="text-gray-600" size={20} />
            Your Top Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.favoriteTopics.map(topic => (
              <span
                key={topic}
                className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {readingHistory.slice(-3).reverse().map(history => {
              const article = storage.getBookmarks().find(b => b.id === history.articleId);
              return article ? (
                <div key={history.readAt} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{article.title}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(history.readAt), 'MMM d, yyyy')} • 
                      {formatReadingTime(history.timeSpent)} reading time
                    </p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};