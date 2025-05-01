import React, { useState, useCallback } from 'react';
import { Search, Settings as SettingsIcon, RefreshCw } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Settings } from './components/Settings';
import { storage } from './utils/storage';
import { NewsArticleList } from './components/NewsArticleList';
import { triggerFetch } from './utils/api';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('home');
  const preferences = storage.getPreferences();

  const handleFetchNewArticles = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await triggerFetch();
      // After triggering fetch, we could refresh the article list
      // This will be handled by the NewsArticleList component's refresh button
    } catch (error) {
      console.error('Failed to fetch new articles:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCategorySelect = useCallback((categoryId: string) => {
    console.log('Category selected:', categoryId);
    setSelectedCategory(categoryId);
  }, []);

  return (
    <div
      className={`min-h-screen ${
        preferences.darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        darkMode={preferences.darkMode}
      />

      <div className='ml-64 p-8'>
        {/* Header */}
        <header className='flex justify-between items-center mb-8'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search news...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-96 ${
                preferences.darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
            <Search
              className={`absolute left-3 top-2.5 ${
                preferences.darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
              size={20}
            />
          </div>

          <div className='flex items-center space-x-4'>
            <button
              onClick={handleFetchNewArticles}
              disabled={isRefreshing}
              className={`flex items-center px-3 py-2 rounded ${
                preferences.darkMode
                  ? 'bg-gray-800 text-gray-300'
                  : 'bg-white text-gray-700'
              } border ${
                preferences.darkMode ? 'border-gray-700' : 'border-gray-200'
              } hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors`}
            >
              <RefreshCw
                size={18}
                className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Fetch News
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-full ${
                preferences.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <SettingsIcon
                size={24}
                className={
                  preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
                }
              />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <NewsArticleList
            darkMode={preferences.darkMode}
            selectedCategory={selectedCategory}
          />
        </main>
      </div>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;
