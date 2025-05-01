#!/bin/bash

# Make sure script exits on any errors
set -e

echo "===== News Aggregator Application Setup ====="

# Check if .env file exists, copy from example if not
if [ ! -f .env ]; then
    echo "No .env file found, creating from example..."
    if [ -f .env-example ]; then
        cp .env-example .env
        echo ".env file created from example."
        echo "NOTE: You may want to edit the .env file to add your NewsAPI key."
    else
        echo "No .env-example file found. Make sure you're in the correct directory."
        exit 1
    fi
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start services
echo "Building and starting services..."
docker-compose up --build -d

echo "Waiting for services to start..."
sleep 5

# Check if the services are running
if docker ps | grep -q news-aggregator; then
    echo "===== Setup Complete ====="
    echo "MongoDB is running at: localhost:27017"
    echo "Backend API is running at: http://localhost:8000"
    echo "Frontend is running at: http://localhost:5173"
    echo ""
    echo "To stop the services, run: docker-compose down"
else
    echo "Something went wrong. Check logs with: docker-compose logs"
fi 