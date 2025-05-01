const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publish_date: string;
  fetched_via: string;
  _id?: string;
}

export interface ApiResponse {
  count: number;
  articles: ApiArticle[];
}

interface FetchResult {
  status: string;
  fetched: {
    rss_count: number;
    news_api_count: number;
    total_count: number;
  };
}

/**
 * Fetch articles from the API
 */
export const fetchArticles = async (
  limit: number = 20,
  skip: number = 0,
  source?: string
): Promise<ApiResponse> => {
  try {
    let url = `${API_URL}/articles?limit=${limit}&skip=${skip}`;
    if (source) {
      url += `&source=${encodeURIComponent(source)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { count: 0, articles: [] };
  }
};

/**
 * Trigger a manual fetch of new articles
 */
export const triggerFetch = async (): Promise<FetchResult> => {
  try {
    const response = await fetch(`${API_URL}/fetch`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering fetch:', error);
    return {
      status: 'error',
      fetched: {
        rss_count: 0,
        news_api_count: 0,
        total_count: 0,
      },
    };
  }
};

/**
 * Get all available sources
 */
export const getSources = async (): Promise<string[]> => {
  try {
    // First, fetch a sample of articles to extract sources
    const { articles } = await fetchArticles(100);

    // Extract unique sources
    const sources = [...new Set(articles.map((article) => article.source))];
    return sources;
  } catch (error) {
    console.error('Error fetching sources:', error);
    return [];
  }
};

// Add the summarize function to the API client
export const summarizeText = async (
  text: string,
  maxLength: number = 150,
  minLength: number = 40
): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        max_length: maxLength,
        min_length: minLength,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Error summarizing text:', error);
    // Fallback: return a shortened version of the text
    return text.split('.').slice(0, 3).join('.') + '.';
  }
};
