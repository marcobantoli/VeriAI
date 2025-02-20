import React from 'react';
import { 
  Home, 
  Newspaper, 
  Bookmark, 
  Settings, 
  TrendingUp,
  Globe,
  Briefcase,
  Heart,
  Zap,
  Music
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const categories = [
    { name: 'Home', icon: Home },
    { name: 'Top Stories', icon: TrendingUp },
    { name: 'World', icon: Globe },
    { name: 'Business', icon: Briefcase },
    { name: 'Health', icon: Heart },
    { name: 'Technology', icon: Zap },
    { name: 'Entertainment', icon: Music }
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0 p-6">
      <div className="flex items-center gap-2 mb-8">
        <Newspaper className="text-blue-600" size={24} />
        <h1 className="text-xl font-bold text-gray-900">NewsAI</h1>
      </div>
      
      <nav>
        <div className="space-y-6">
          {categories.map((category) => (
            <button
              key={category.name}
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 w-full transition-colors"
            >
              <category.icon size={20} />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 space-y-6">
          <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 w-full transition-colors">
            <Bookmark size={20} />
            <span>Saved Articles</span>
          </button>
          <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 w-full transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};