import React, { useState } from 'react';
import { Search, Bell, Settings as SettingsIcon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ArticleCard } from './components/ArticleCard';
import { Settings } from './components/Settings';
import { UserDashboard } from './components/UserDashboard';
import { mockArticles } from './utils/mockData';
import { storage } from './utils/storage';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const preferences = storage.getPreferences();

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news..."
              className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-96 ${
                preferences.darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
            <Search className={`absolute left-3 top-2.5 ${preferences.darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className={`p-2 rounded-full ${preferences.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} relative`}>
              <Bell size={24} className={preferences.darkMode ? 'text-gray-300' : 'text-gray-700'} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-full ${preferences.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <SettingsIcon size={24} className={preferences.darkMode ? 'text-gray-300' : 'text-gray-700'} />
            </button>
          </div>
        </header>

        {/* User Dashboard */}
        <div className="mb-8">
          <UserDashboard />
        </div>

        {/* Main Content */}
        <main>
          <h2 className={`text-2xl font-bold mb-6 ${preferences.darkMode ? 'text-white' : 'text-gray-900'}`}>
            Top Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </main>
      </div>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;