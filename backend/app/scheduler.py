import asyncio
import schedule
import time
import threading
from news_fetcher import fetch_all_news
import config


def run_fetch_job():
    """Run the fetch job in an event loop"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(fetch_all_news())
    print(f"Scheduled news fetch complete: {result}")
    loop.close()


def start_scheduler():
    """Start the scheduler in a background thread"""
    # Schedule the job to run at the specified interval
    schedule.every(config.FETCH_INTERVAL_MINUTES).minutes.do(run_fetch_job)

    # Run the job immediately on startup
    run_fetch_job()

    # Start the scheduler in a separate thread
    def run_scheduler():
        while True:
            schedule.run_pending()
            time.sleep(1)

    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()

    return scheduler_thread
