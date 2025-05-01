import React from 'react';
import { Newspaper, Bookmark, Settings } from 'lucide-react';
import { categories } from '../utils/categories';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  darkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  darkMode = false,
}) => {
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-700';
  const borderClass = darkMode ? 'border-gray-800' : 'border-gray-200';
  const hoverClass = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const activeClass = darkMode
    ? 'bg-gray-800 text-blue-400'
    : 'bg-blue-50 text-blue-600';

  const handleCategoryClick = (categoryId: string) => {
    console.log('Sidebar category clicked:', categoryId);
    onSelectCategory(categoryId);
  };

  return (
    <div
      className={`w-64 ${bgClass} h-screen shadow-lg fixed left-0 top-0 p-6`}
    >
      <div className={`flex items-center gap-2 mb-8 ${textClass}`}>
        <Newspaper className='text-blue-600' size={24} />
        <h1 className='text-xl font-bold'>NewsAI</h1>
      </div>

      <nav>
        <div className='space-y-1'>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-3 py-2 px-3 rounded-lg w-full transition-colors cursor-pointer ${
                selectedCategory === category.id
                  ? activeClass
                  : `${secondaryTextClass} ${hoverClass}`
              }`}
            >
              <category.icon size={20} />
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className={`mt-8 pt-8 border-t ${borderClass} space-y-1`}>
          <button
            className={`flex items-center gap-3 py-2 px-3 rounded-lg ${secondaryTextClass} ${hoverClass} w-full transition-colors cursor-pointer`}
          >
            <Bookmark size={20} />
            <span>Saved Articles</span>
          </button>
          <button
            className={`flex items-center gap-3 py-2 px-3 rounded-lg ${secondaryTextClass} ${hoverClass} w-full transition-colors cursor-pointer`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
