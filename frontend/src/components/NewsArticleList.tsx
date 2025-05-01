import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ApiArticle, fetchArticles, getSources } from '../utils/api';
import { RefreshCw } from 'lucide-react';
import { categorizeArticle } from '../utils/categories';
import { ArticleDetail } from './ArticleDetail';

interface NewsArticleListProps {
  darkMode?: boolean;
  selectedCategory?: string;
}

export const NewsArticleList: React.FC<NewsArticleListProps> = ({
  darkMode = false,
  selectedCategory = 'home',
}) => {
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ApiArticle[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<ApiArticle | null>(
    null
  );
  const limit = 12;

  const loadArticles = async (reset = false) => {
    try {
      setLoading(true);
      const pageToLoad = reset ? 0 : page;
      const skip = pageToLoad * limit;

      const response = await fetchArticles(
        limit,
        skip,
        selectedSource || undefined
      );

      if (reset) {
        setArticles(response.articles);
        setPage(0);
      } else {
        setArticles((prev) => [...prev, ...response.articles]);
      }

      setError(null);
    } catch (_err) {
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter articles based on selected category
  useEffect(() => {
    console.log('Category changed to:', selectedCategory);
    if (selectedCategory === 'home') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(
        articles.filter((article) => {
          const categories = categorizeArticle(
            article.title,
            article.description || ''
          );
          return categories.includes(selectedCategory);
        })
      );
    }
  }, [selectedCategory, articles]);

  const loadSources = async () => {
    const fetchedSources = await getSources();
    setSources(fetchedSources);
  };

  useEffect(() => {
    loadArticles(true);
    loadSources();
  }, [selectedSource]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
    loadArticles();
  };

  const handleArticleClick = (article: ApiArticle) => {
    setSelectedArticle(article);
  };

  const handleCloseDetail = () => {
    setSelectedArticle(null);
  };

  // Group articles by source
  const articlesBySource = filteredArticles.reduce((groups, article) => {
    const source = article.source;
    if (!groups[source]) {
      groups[source] = [];
    }
    groups[source].push(article);
    return groups;
  }, {} as Record<string, ApiArticle[]>);

  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const cardClass = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  // Get the title for the current view
  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'home':
        return 'All News';
      case 'top-stories':
        return 'Top Stories';
      case 'world':
        return 'World News';
      case 'business':
        return 'Business News';
      case 'health':
        return 'Health News';
      case 'technology':
        return 'Technology News';
      case 'entertainment':
        return 'Entertainment News';
      default:
        return 'News Articles';
    }
  };

  return (
    <div>
      {/* Source filter */}
      <div className='mb-6 flex flex-wrap gap-2'>
        <button
          onClick={() => setSelectedSource(null)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedSource === null
              ? 'bg-blue-600 text-white'
              : darkMode
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          All Sources
        </button>
        {sources.map((source) => (
          <button
            key={source}
            onClick={() => setSelectedSource(source)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedSource === source
                ? 'bg-blue-600 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {source}
          </button>
        ))}
        <button
          onClick={() => loadArticles(true)}
          className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
            darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className='mb-4 p-4 bg-red-100 text-red-700 rounded-lg'>
          {error}
        </div>
      )}

      {/* Title for the current category */}
      <h2
        className={`text-2xl font-bold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        {getCategoryTitle()}
      </h2>

      {/* Display articles */}
      {selectedSource ? (
        <div className='space-y-4'>
          <h3 className={`text-xl font-semibold ${textClass}`}>
            {selectedSource}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredArticles
              .filter((article) => article.source === selectedSource)
              .map((article, index) => (
                <ArticleCard
                  key={article._id || index}
                  article={article}
                  darkMode={darkMode}
                  onClick={() => handleArticleClick(article)}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className='space-y-8'>
          {Object.entries(articlesBySource).map(([source, sourceArticles]) => (
            <div key={source} className='space-y-4'>
              <h3 className={`text-xl font-semibold ${textClass}`}>{source}</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {sourceArticles.map((article, index) => (
                  <ArticleCard
                    key={article._id || index}
                    article={article}
                    darkMode={darkMode}
                    onClick={() => handleArticleClick(article)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state for filtered results */}
      {!loading && filteredArticles.length === 0 && (
        <div className={`text-center p-8 rounded-lg border ${cardClass}`}>
          <p className={`text-lg ${textClass}`}>
            No articles found in this category.
          </p>
          <button
            onClick={() => loadArticles(true)}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Refresh
          </button>
        </div>
      )}

      {/* Load more button */}
      {filteredArticles.length > 0 && (
        <div className='mt-8 text-center'>
          <button
            onClick={loadMore}
            disabled={loading}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              darkMode
                ? 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Article detail modal */}
      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={handleCloseDetail}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

interface ArticleCardProps {
  article: ApiArticle;
  darkMode?: boolean;
  onClick?: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  darkMode = false,
  onClick,
}) => {
  const cardClass = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const subtextClass = darkMode ? 'text-gray-400' : 'text-gray-500';

  // Format the date
  const formattedDate = (() => {
    try {
      return format(new Date(article.publish_date), 'MMM dd, yyyy');
    } catch (_e) {
      return 'Unknown date';
    }
  })();

  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${cardClass}`}
      onClick={onClick}
    >
      <div className='p-4'>
        <div className='flex justify-between items-start'>
          <span
            className={`inline-block px-2 py-1 text-xs rounded ${
              darkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {article.source}
          </span>
          <span className={`text-xs ${subtextClass}`}>{formattedDate}</span>
        </div>

        <h3 className={`mt-2 text-lg font-medium ${textClass}`}>
          {article.title}
        </h3>

        <p className={`mt-2 truncate text-sm ${subtextClass}`}>
          {article.description || 'No description available.'}
        </p>

        <div className='mt-4 flex justify-between items-center'>
          <span className={`text-xs ${subtextClass}`}>
            Via {article.fetched_via}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
            }}
            className='px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};
