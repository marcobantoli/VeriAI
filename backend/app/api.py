from fastapi import FastAPI, Query, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from database import get_articles
from news_fetcher import fetch_all_news
import json
from bson import ObjectId
import datetime
import requests
import os


# Custom JSON encoder to handle MongoDB ObjectId and datetime
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return super().default(obj)


# Create FastAPI app
app = FastAPI(title="News Aggregator API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],  # Frontend development servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define response models
class ArticleResponse(BaseModel):
    title: str
    description: Optional[str] = None
    url: str
    source: str
    publish_date: str
    fetched_via: str

    class Config:
        json_encoders = {ObjectId: str, datetime.datetime: lambda v: v.isoformat()}


class SummarizeRequest(BaseModel):
    text: str
    max_length: int = 150
    min_length: int = 40


class SummarizeResponse(BaseModel):
    summary: str


@app.get("/")
async def root():
    return {"message": "News Aggregator API"}


@app.get("/articles")
async def get_news_articles(
    limit: int = Query(20, gt=0, le=100),
    skip: int = Query(0, ge=0),
    source: Optional[str] = None,
):
    articles = await get_articles(limit, skip, source)

    # Convert MongoDB documents to JSON-serializable objects
    serialized_articles = json.loads(json.dumps(articles, cls=MongoJSONEncoder))

    return {"count": len(serialized_articles), "articles": serialized_articles}


@app.post("/fetch")
async def trigger_fetch():
    """Manually trigger news fetching"""
    result = await fetch_all_news()
    return {"status": "success", "fetched": result}


@app.post("/summarize", response_model=SummarizeResponse)
async def summarize_text(request: SummarizeRequest = Body(...)):
    """Generate a summary of the provided text using BART"""
    try:
        # Use Hugging Face Inference API or your own API
        API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
        headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY', '')}"}

        payload = {
            "inputs": request.text,
            "parameters": {
                "max_length": request.max_length,
                "min_length": request.min_length,
                "do_sample": False,
            },
        }

        # If no API key is provided, use a simple fallback summarization
        if not os.getenv("HUGGINGFACE_API_KEY"):
            # Simple fallback: first few sentences
            sentences = request.text.split(".")
            summary = ".".join(sentences[:3]) + "."
            return {"summary": summary}

        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()

        # Parse the response
        summary_data = response.json()

        if isinstance(summary_data, list) and len(summary_data) > 0:
            summary = summary_data[0].get("summary_text", "")
        else:
            summary = summary_data.get("summary_text", "")

        return {"summary": summary}
    except Exception as e:
        # Fallback to a simpler approach if the API fails
        sentences = request.text.split(".")
        summary = ".".join(sentences[:3]) + "."
        return {"summary": summary}
