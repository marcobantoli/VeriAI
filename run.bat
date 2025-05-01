@echo off
echo ===== News Aggregator Application Setup =====

REM Check if .env file exists, copy from example if not
if not exist .env (
    echo No .env file found, creating from example...
    if exist .env-example (
        copy .env-example .env
        echo .env file created from example.
        echo NOTE: You may want to edit the .env file to add your NewsAPI key.
    ) else (
        echo No .env-example file found. Make sure you're in the correct directory.
        exit /b 1
    )
)

REM Check if Docker is running
docker info > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Build and start services
echo Building and starting services...
docker-compose up --build -d

echo Waiting for services to start...
timeout /t 5 /nobreak > nul

REM Check if services are running
docker ps | findstr news-aggregator > nul
if %ERRORLEVEL% equ 0 (
    echo ===== Setup Complete =====
    echo MongoDB is running at: localhost:27017
    echo Backend API is running at: http://localhost:8000
    echo Frontend is running at: http://localhost:5173
    echo.
    echo To stop the services, run: docker-compose down
) else (
    echo Something went wrong. Check logs with: docker-compose logs
) 