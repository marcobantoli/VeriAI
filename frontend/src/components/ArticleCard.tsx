import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Bookmark, Share2, ThumbsUp, BookmarkCheck, Clock, Eye } from 'lucide-react';
import { Article } from '../types';
import { storage } from '../utils/storage';
import { calculateReadingTime } from '../utils/readingTime';
import { summarizeText } from '../utils/summarizer';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bookmarks = storage.getBookmarks();
    setIsBookmarked(bookmarks.some(b => b.id === article.id));
  }, [article.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !readingStartTime) {
            setReadingStartTime(Date.now());
          } else if (!entry.isIntersecting && readingStartTime) {
            const timeSpent = Math.floor((Date.now() - readingStartTime) / 1000);
            storage.addToHistory(article.id, timeSpent);
            setReadingStartTime(null);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [article.id, readingStartTime]);

  const sentimentColor = {
    positive: 'bg-green-100 text-green-800',
    neutral: 'bg-gray-100 text-gray-800',
    negative: 'bg-red-100 text-red-800'
  }[article.sentiment];

  const readingTime = calculateReadingTime(article.content);

  const handleBookmark = () => {
    if (isBookmarked) {
      storage.removeBookmark(article.id);
    } else {
      storage.saveBookmark(article);
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
    >
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm text-gray-600">{article.source}</span>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>{readingTime} min read</span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            {format(new Date(article.publishedAt), 'MMM d, yyyy')}
          </span>
          <div className="flex items-center space-x-1">
            <Eye size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              {storage.getReadingHistory().filter(h => h.articleId === article.id).length} views
            </span>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-3 text-gray-900">{article.title}</h2>
        <div className="relative">
          <p className="text-gray-600 mb-4">
            {isExpanded ? article.content : article.summary}
          </p>
          {article.content !== article.summary && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className={`px-3 py-1 rounded-full text-sm ${sentimentColor}`}>
            {article.sentiment}
          </span>
          <div className="flex gap-4">
            <button 
              className={`text-gray-600 hover:text-blue-600 transition-colors ${likes > 0 ? 'text-blue-600' : ''}`}
              onClick={() => setLikes(prev => prev + 1)}
            >
              <ThumbsUp size={20} />
              {likes > 0 && <span className="ml-1 text-sm">{likes}</span>}
            </button>
            <button 
              className={`text-gray-600 hover:text-blue-600 transition-colors ${isBookmarked ? 'text-blue-600' : ''}`}
              onClick={handleBookmark}
            >
              {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
            <button 
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onClick={handleShare}
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};