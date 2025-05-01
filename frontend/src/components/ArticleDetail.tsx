import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, ChevronLeft, RefreshCw } from 'lucide-react';
import { ApiArticle } from '../utils/api';
import { summarizeText } from '../utils/api';

interface ArticleDetailProps {
  article: ApiArticle;
  onClose: () => void;
  darkMode?: boolean;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onClose,
  darkMode = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Text classes based on dark mode
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const subtextClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-800' : 'border-gray-200';

  // Format the date
  const formattedDate = (() => {
    try {
      return format(new Date(article.publish_date), 'MMM dd, yyyy');
    } catch (_e) {
      return 'Unknown date';
    }
  })();

  useEffect(() => {
    // Generate a summary when the component mounts
    generateSummary();
  }, [article]);

  const generateSummary = async () => {
    if (!article.description) {
      setError('No content to summarize');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await summarizeText(article.description, 150, 40);
      setSummary(result);
    } catch (error) {
      setError('Failed to generate summary');
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        darkMode ? 'bg-black bg-opacity-75' : 'bg-gray-500 bg-opacity-50'
      }`}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-lg shadow-xl ${bgClass} p-6`}
      >
        {/* Header with back button and close button */}
        <div className='flex justify-between items-center mb-4'>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 ${textClass} hover:opacity-70 transition-opacity`}
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>

          <button
            onClick={onClose}
            className={`${textClass} hover:opacity-70 transition-opacity`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Article source and date */}
        <div className='flex justify-between items-center mb-4'>
          <div
            className={`px-3 py-1 rounded-lg text-sm ${
              darkMode
                ? 'bg-gray-800 text-gray-300'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {article.source}
          </div>
          <div className={`text-sm ${subtextClass}`}>{formattedDate}</div>
        </div>

        {/* Article title */}
        <h1 className={`text-2xl font-bold mb-4 ${textClass}`}>
          {article.title}
        </h1>

        {/* Summary section */}
        <div
          className={`mb-6 p-4 rounded-lg border ${borderClass} ${
            darkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}
        >
          <div className='flex justify-between items-center mb-2'>
            <h2 className={`font-semibold ${textClass}`}>AI Summary</h2>
            <button
              onClick={generateSummary}
              disabled={loading}
              className={`flex items-center gap-1 text-sm ${
                darkMode
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              } transition-colors`}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
          </div>

          {loading ? (
            <div className={`text-sm ${subtextClass} italic`}>
              Generating summary...
            </div>
          ) : error ? (
            <div className={`text-sm text-red-500`}>{error}</div>
          ) : (
            <p className={`text-sm ${textClass}`}>{summary}</p>
          )}
        </div>

        {/* Full article content */}
        <div className='mb-8'>
          <h2 className={`font-semibold mb-2 ${textClass}`}>Full Content</h2>
          <p className={`text-sm whitespace-pre-line ${textClass}`}>
            {article.description || 'No content available.'}
          </p>
        </div>

        {/* Read original button */}
        <div className='flex justify-center mt-6'>
          <a
            href={article.url}
            target='_blank'
            rel='noopener noreferrer'
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            Read Original Article
          </a>
        </div>
      </div>
    </div>
  );
};
