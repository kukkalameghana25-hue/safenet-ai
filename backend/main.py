
import re
import ipaddress
from urllib.parse import urlparse

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from auth import router as auth_router


# --------------------------------
# CREATE FASTAPI APPLICATION
# --------------------------------

app = FastAPI(
    title="SafeNet AI",
    description="AI-Based Phishing URL Detection System",
    version="1.0"
)


# --------------------------------
# CORS CONFIGURATION
# --------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://safenet-ai-orcin.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------
# CONNECT AUTHENTICATION ROUTER
# --------------------------------

app.include_router(auth_router)


# --------------------------------
# URL REQUEST MODEL
# --------------------------------

class URLRequest(BaseModel):
    url: str


# --------------------------------
# HOME ROUTE
# --------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to SafeNet AI!",
        "status": "Backend is running successfully"
    }


# --------------------------------
# HEALTH CHECK
# --------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# --------------------------------
# URL SCANNING FUNCTION
# --------------------------------

@app.post("/scan")
def scan_url(data: URLRequest):

    original_url = data.url.strip()

    if not original_url:
        return {
            "status": "Invalid",
            "message": "Please enter a URL",
            "reasons": []
        }

    url = original_url

    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    parsed_url = urlparse(url)
    domain = parsed_url.hostname

    if not domain or "." not in domain:
        return {
            "status": "Invalid",
            "message": "Please enter a valid URL",
            "reasons": ["Invalid domain name"]
        }

    reasons = []

    # Check IP address instead of domain
    try:
        ipaddress.ip_address(domain)
        reasons.append("URL uses an IP address instead of a domain")
    except ValueError:
        pass

    # Check suspicious keywords
    suspicious_keywords = [
        "login",
        "verify",
        "update",
        "account",
        "password",
        "banking",
        "confirm",
        "free",
        "gift"
    ]

    for keyword in suspicious_keywords:
        if keyword in url.lower():
            reasons.append(
                f"URL contains suspicious keyword: {keyword}"
            )

    # Check @ symbol
    if "@" in url:
        reasons.append("URL contains an @ symbol")

    # Check number of subdomains
    if len(domain.split(".")) > 3:
        reasons.append("URL contains too many subdomains")

    # Check URL shorteners
    shorteners = [
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "goo.gl",
        "ow.ly"
    ]

    if domain.lower() in shorteners:
        reasons.append("URL uses a URL shortening service")

    # Determine result
    if reasons:
        status = "Suspicious"
        message = "This URL has suspicious characteristics."
    else:
        status = "Safe"
        message = "No suspicious patterns were detected."

    return {
        "status": status,
        "message": message,
        "reasons": reasons,
        "url": original_url
    }
