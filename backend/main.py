from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import httpx
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import anthropic
from datetime import datetime, timedelta
import re


load_dotenv()

app = FastAPI(title="Junior Repo Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)