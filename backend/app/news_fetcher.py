import feedparser
import httpx
from datetime import datetime
import config
from database import save_article
import time


async def fetch_from_rss():
    """
    Fetch news from RSS feeds
    """
    articles = []

    for feed_info in config.RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_info["url"])
            source_name = feed_info["name"]

            for entry in feed.entries:
                # Create article object
                article = {
                    "title": entry.get("title", ""),
                    "description": entry.get("summary", ""),
                    "url": entry.get("link", ""),
                    "source": source_name,
                    "publish_date": (
                        datetime.fromtimestamp(time.mktime(entry.published_parsed))
                        if hasattr(entry, "published_parsed")
                        else datetime.utcnow()
                    ),
                    "fetched_via": "rss",
                }

                # Save to database
                if article["url"]:
                    saved = await save_article(article)
                    if saved:
                        articles.append(article)

        except Exception as e:
            print(f"Error fetching from RSS feed {feed_info['name']}: {e}")

    return articles


async def fetch_from_news_api():
    """
    Fetch news from NewsAPI
    """
    if not config.NEWS_API_KEY:
        print("NewsAPI key not configured, skipping.")
        return []

    articles = []

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                config.NEWS_API_URL, params=config.NEWS_API_PARAMS
            )
            data = response.json()

            if data.get("status") == "ok":
                for item in data.get("articles", []):
                    article = {
                        "title": item.get("title", ""),
                        "description": item.get("description", ""),
                        "url": item.get("url", ""),
                        "source": item.get("source", {}).get("name", "NewsAPI"),
                        "publish_date": (
                            datetime.fromisoformat(
                                item.get("publishedAt", "").replace("Z", "+00:00")
                            )
                            if item.get("publishedAt")
                            else datetime.utcnow()
                        ),
                        "fetched_via": "newsapi",
                    }

                    # Save to database
                    if article["url"]:
                        saved = await save_article(article)
                        if saved:
                            articles.append(article)
    except Exception as e:
        print(f"Error fetching from NewsAPI: {e}")

    return articles


async def fetch_all_news():
    """
    Fetch news from all configured sources
    """
    rss_articles = await fetch_from_rss()
    news_api_articles = await fetch_from_news_api()

    return {
        "rss_count": len(rss_articles),
        "news_api_count": len(news_api_articles),
        "total_count": len(rss_articles) + len(news_api_articles),
    }
