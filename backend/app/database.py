from pymongo import MongoClient
from datetime import datetime
import config
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Connect to MongoDB with retry logic
def get_database_connection(max_retries=5, retry_delay=5):
    retries = 0
    while retries < max_retries:
        try:
            logger.info(f"Connecting to MongoDB at {config.MONGO_URI}")
            client = MongoClient(config.MONGO_URI, serverSelectionTimeoutMS=5000)
            # Validate connection
            client.admin.command("ping")
            logger.info("Successfully connected to MongoDB")
            return client
        except Exception as e:
            retries += 1
            logger.warning(
                f"Failed to connect to MongoDB (attempt {retries}/{max_retries}): {e}"
            )
            if retries < max_retries:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                logger.error(
                    "Maximum connection attempts reached. Could not connect to MongoDB."
                )
                raise


# Establish connection with retry
client = get_database_connection()
db = client[config.MONGO_DB]
collection = db[config.MONGO_COLLECTION]

# Create index for url (to avoid duplicates) and publish_date (for sorting)
try:
    collection.create_index([("url", 1)], unique=True)
    collection.create_index([("publish_date", -1)])
    logger.info("MongoDB indexes created successfully")
except Exception as e:
    logger.error(f"Error creating MongoDB indexes: {e}")


async def save_article(article):
    """
    Save an article to the database if it doesn't already exist
    """
    try:
        # Add timestamp for when we added to our DB
        article["stored_at"] = datetime.utcnow()

        # Use upsert to avoid duplicates
        result = collection.update_one(
            {"url": article["url"]}, {"$set": article}, upsert=True
        )
        return result.upserted_id or result.modified_count > 0
    except Exception as e:
        logger.error(f"Error saving article: {e}")
        return False


async def get_articles(limit=20, skip=0, source=None):
    """
    Get articles from the database
    """
    query = {}
    if source:
        query["source"] = source

    return list(
        collection.find(query, sort=[("publish_date", -1)], skip=skip, limit=limit)
    )
