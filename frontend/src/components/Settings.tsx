import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { storage } from '../utils/storage';
import { UserPreferences } from '../types';

export const Settings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(storage.getPreferences());

  const availableCategories = [
    'Top Stories', 'World', 'Business', 'Technology', 
    'Health', 'Science', 'Sports', 'Entertainment'
  ];

  const availableSources = [
    'Reuters', 'Associated Press', 'Bloomberg', 
    'The New York Times', 'BBC News', 'TechCrunch'
  ];

  const handleSave = () => {
    storage.savePreferences(preferences);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">News Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableCategories.map(category => (
                <label 
                  key={category} 
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={preferences.categories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPreferences(prev => ({
                          ...prev,
                          categories: [...prev.categories, category]
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          categories: prev.categories.filter(c => c !== category)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">News Sources</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSources.map(source => (
                <label 
                  key={source} 
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={preferences.sources.includes(source)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPreferences(prev => ({
                          ...prev,
                          sources: [...prev.sources, source]
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          sources: prev.sources.filter(s => s !== source)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{source}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Update Frequency</h3>
            <select
              value={preferences.updateFrequency}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                updateFrequency: e.target.value as UserPreferences['updateFrequency']
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="realtime">Real-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};