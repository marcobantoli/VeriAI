# AI News Aggregator

A full-stack application that aggregates news articles from various sources using AI-powered features.

## Project Structure

This project consists of two main parts:

- **Backend**: A FastAPI application that fetches, processes, and serves news articles
- **Frontend**: A React application that displays the articles with filtering and categorization

## Running the Application

### Option 1: Using Docker Compose (Recommended)

The easiest way to run the entire application is with Docker Compose:

1. Make sure Docker and Docker Compose are installed on your system.

2. Copy the environment file and modify as needed:

   ```
   cp .env-example .env
   ```

   Edit the `.env` file to add your NewsAPI key if you want to use that service.

3. Start all services:

   ```
   docker-compose up -d
   ```

4. Access the application:

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - MongoDB: localhost:27017

5. To stop all services:

   ```
   docker-compose down
   ```

### Option 2: Manual Setup

#### Backend Setup

1. Create a virtual environment and install dependencies:

   ```
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Set up MongoDB (install locally or use a cloud service)

3. Create a `.env` file in the app directory (see backend README for details)

4. Start the application:
   ```
   cd app
   python main.py
   ```

#### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Features

- **Multiple News Sources**: Fetches news from RSS feeds and NewsAPI
- **Automatic Updates**: Periodically fetches new articles
- **Source Categorization**: Displays articles grouped by their source
- **Source Filtering**: Filter articles by specific sources
- **Pagination**: Load more articles as needed
- **Dark/Light Mode**: User interface adapts to theme preference
- **Responsive Design**: Works on all device sizes

## Development

See the individual READMEs in the backend and frontend directories for more detailed development information.
