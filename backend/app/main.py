import uvicorn
import sys
import os
import signal
import logging
from api import app
from scheduler import start_scheduler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

# Global variable to hold the scheduler thread
scheduler_thread = None


def handle_exit(signum, frame):
    """Handle exit signals gracefully"""
    logger.info(f"Received signal {signum}. Shutting down...")
    # The scheduler thread is a daemon, so it will be terminated automatically
    sys.exit(0)


if __name__ == "__main__":
    # Register signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    try:
        # Start the news fetching scheduler
        logger.info("Starting scheduler...")
        scheduler_thread = start_scheduler()
        logger.info("Scheduler started successfully")

        # Run the FastAPI app
        logger.info("Starting FastAPI application...")
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except Exception as e:
        logger.error(f"Error in main application: {e}")
        sys.exit(1)
