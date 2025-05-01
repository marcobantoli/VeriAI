# News Aggregator Backend

A FastAPI backend for an AI news aggregator that fetches news from RSS feeds and NewsAPI.

## Tech Stack

- **Language:** Python with FastAPI
- **News Fetching:** feedparser (RSS), NewsAPI.org (optional)
- **Database:** MongoDB
- **Scheduler:** Python's schedule library
- **Containerization:** Docker and Docker Compose

## Setup Options

### Option 1: Using Docker Compose (from project root)

The recommended way to run this backend is using the Docker Compose setup from the project root.
See the main README.md file at the project root for instructions.

### Option 2: Manual Setup

1. Create a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Set up MongoDB:

   - Install MongoDB or use a cloud service like MongoDB Atlas
   - Create a database named "news_aggregator"

4. Create a `.env` file in the app directory with the following variables:

   ```
   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017
   MONGO_DB=news_aggregator
   MONGO_COLLECTION=news_articles

   # NewsAPI (optional)
   NEWS_API_KEY=your_newsapi_key_here

   # Scheduler settings
   FETCH_INTERVAL_MINUTES=60
   ```

5. Start the FastAPI application:
   ```
   cd app
   python main.py
   ```

The server will start at `http://localhost:8000`.

## API Endpoints

- `GET /`: Basic API information
- `GET /articles`: Get news articles with optional filtering
  - Parameters:
    - `limit`: Maximum number of articles to return (default: 20)
    - `skip`: Number of articles to skip (for pagination)
    - `source`: Filter by news source
- `POST /fetch`: Manually trigger news fetching

## Features

- **Automatic News Fetching**: News is automatically fetched every hour (configurable)
- **Duplicate Prevention**: Articles with the same URL are not duplicated in the database
- **Multiple Sources**: Fetches from both RSS feeds and NewsAPI
- **Pagination**: Supports pagination for article retrieval
- **Source Filtering**: Filter articles by their source
- **Containerized Setup**: Easy deployment with Docker and Docker Compose
