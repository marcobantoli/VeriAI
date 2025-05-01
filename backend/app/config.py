import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB settings
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "news_aggregator")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "news_articles")

# RSS feeds
RSS_FEEDS = [
    {"name": "BBC News", "url": "http://feeds.bbci.co.uk/news/rss.xml"},
    {"name": "CNN", "url": "http://rss.cnn.com/rss/edition.rss"},
    {"name": "The Verge", "url": "https://www.theverge.com/rss/index.xml"},
]

# NewsAPI settings (if you decide to use it)
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"
NEWS_API_PARAMS = {"country": "us", "apiKey": NEWS_API_KEY}

# Scheduler settings
FETCH_INTERVAL_MINUTES = 60  # Fetch news every hour
