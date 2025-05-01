# News Aggregator Frontend

A React frontend for the AI news aggregator application. This app displays news articles fetched from various sources using the FastAPI backend.

## Tech Stack

- **Framework:** React with TypeScript
- **Styling:** Tailwind CSS
- **Date Formatting:** date-fns
- **Icons:** Lucide React
- **Build Tool:** Vite

## Setup Options

### Option 1: Using Docker Compose (from project root)

The recommended way to run this frontend is using the Docker Compose setup from the project root.
See the main README.md file at the project root for instructions.

### Option 2: Manual Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Features

- **Source Categorization**: Articles are automatically grouped by source
- **Source Filtering**: Filter articles by specific sources
- **Pagination**: Load more articles as you scroll
- **Dark/Light Mode**: Compatible with the user's theme preference
- **Manual Refresh**: Fetch the latest articles with the refresh button
- **Responsive Design**: Works on mobile, tablet, and desktop

## Connection to Backend

This frontend connects to the FastAPI backend at `http://localhost:8000`. Make sure the backend is running before starting the frontend. The API URL can be configured using the `VITE_API_URL` environment variable.

## Development

The main components are:

- `NewsArticleList`: Displays articles with source categorization
- `App`: Main application component that manages the layout
- `api.ts`: API client for interacting with the backend

To add new features or modify existing ones, start by examining these files.
