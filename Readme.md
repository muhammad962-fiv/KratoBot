# KratoBot - AI-Powered Digital Marketing Strategy Generator

KratoBot is a full-stack AI-powered platform that generates comprehensive digital marketing strategies by combining **Natural Language Processing (NLP)**, **Sentiment Analysis ML models**, **SEO analysis**, and **competitor intelligence**. Simply provide your brand website and competitor domains, and KratoBot will scrape, analyze, and produce an actionable marketing strategy report powered by Google Gemini.

---

## Features

- **Automated Web Scraping** - Crawls brand and competitor websites to extract meaningful content for analysis
- **NLP Keyword Extraction** - Uses KeyBERT with SentenceTransformers (`all-MiniLM-L6-v2`) to identify high-value keywords and keyphrases
- **Sentiment Analysis** - Leverages DistilBERT (`distilbert-base-uncased-finetuned-sst-2-english`) to measure content sentiment on a 0-1 scale
- **Authority Score Calculation** - Custom weighted algorithm combining referring domains, backlinks, domain score, keyword density, and sentiment
- **Competitor Analysis** - Side-by-side comparison of brand vs. competitors across SEO metrics, keywords, sentiment, and authority
- **Domain Metrics** - Fetches real-time domain score, referring domains, and backlink counts via Apify
- **AI Strategy Reports** - Generates detailed Markdown strategy reports using Google Gemini covering SEO strategy, content strategy, backlink building, social media plans, and Google Ads campaigns
- **User Authentication** - JWT-based authentication with secure registration and login
- **Interactive Dashboard** - View, manage, and track all marketing strategy reports in a modern React dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, React Markdown |
| **Backend** | Next.js 15 (API Routes), TypeScript, Node.js |
| **ML Services** | Python 3.11, FastAPI, KeyBERT, SentenceTransformers, DistilBERT, PyTorch, Hugging Face Transformers |
| **Database** | MySQL (mysql2 connection pool) |
| **LLM** | Google Gemini 3.1 Flash Lite |
| **Web Scraping** | Cheerio, Axios |
| **External APIs** | Apify (domain metrics), SerpAPI (search results) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Containerization** | Docker (ML microservice) |

---

## Architecture

```
+------------------+       +-------------------+       +--------------------+
|    Frontend      | ----> |    Backend API     | ----> |  Python ML Service |
|  (Next.js/React) |       |  (Next.js/Node.js) |       | (FastAPI + Models) |
+------------------+       +-------------------+       +--------------------+
                                   |                            |
                                   v                            |
                            +-------------+                     |
                            |    MySQL     |                     |
                            +-------------+                     |
                                   |                            |
                                   v                            |
                            +-------------+                     |
                            |    Apify     | <------------------+
                            |  (Metrics)   |
                            +-------------+
```

### Data Flow

1. User submits a brand website and competitor domains via the frontend
2. Backend **orchestrator** triggers the pipeline
3. **Web scraper** crawls all websites and extracts clean text content
4. Text is sent to the **Python ML microservice** for keyword extraction (KeyBERT) and sentiment analysis (DistilBERT)
5. **Apify API** fetches domain metrics (domain score, referring domains, backlinks)
6. **Authority scores** are computed using a weighted formula across all signals
7. All structured data is sent to **Google Gemini** to generate a comprehensive strategy report
8. Results are stored in MySQL and displayed on the frontend dashboard

---

## Project Structure

```
KratoBot/
├── backend/                    # Next.js backend API
│   ├── config/
│   │   └── database.ts         # MySQL connection pool
│   ├── middleware/
│   │   ├── auth.ts             # JWT verification middleware
│   │   ├── errorHandler.ts     # Global error handler
│   │   └── validation.ts       # Request validation (register, login, project)
│   ├── services/
│   │   ├── orchestrator.ts     # Main pipeline coordinator
│   │   ├── ml/
│   │   │   ├── keyword_extractor.ts    # Calls ML service for keywords
│   │   │   ├── sentiment_analyzer.ts   # Calls ML service for sentiment
│   │   │   └── authority_calculator.ts # Authority score computation
│   │   ├── scraping/
│   │   │   ├── webScraper.ts           # Website crawler (Cheerio)
│   │   │   └── metricsFetcher.ts       # SerpAPI backlink estimation
│   │   └── database/
│   │       ├── userService.ts          # User CRUD
│   │       ├── projectService.ts       # Project CRUD
│   │       ├── reportService.ts        # Report CRUD
│   │       ├── competitorService.ts    # Competitor CRUD
│   │       └── analyticsService.ts     # Analytics queries
│   ├── types/
│   │   ├── api.ts              # API type definitions
│   │   ├── database.ts         # Database type definitions
│   │   └── ml.ts               # ML service type definitions
│   ├── utils/
│   │   ├── cors.ts             # CORS middleware
│   │   ├── logger.ts           # Logging utility
│   │   ├── textCleaner.ts      # Text cleaning
│   │   └── validators.ts       # Validation helpers
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
├── frontend/                   # Next.js frontend
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout
│   │   ├── (auth)/
│   │   │   ├── login/          # Login page
│   │   │   └── signup/         # Signup page
│   │   └── dashboard/
│   │       ├── page.tsx        # Dashboard overview
│   │       ├── layout.tsx      # Dashboard layout
│   │       ├── new/            # New project creation
│   │       └── [id]/           # Individual report view
│   ├── styles/
│   │   └── globals.css         # Global styles
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
├── python/                     # Python ML microservice
│   ├── ML_Services.py          # FastAPI app with ML endpoints
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile              # Docker config for ML service
├── .env                        # Root environment variables
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.11+
- **MySQL** 8.0+
- **Docker** (optional, for containerized ML service)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd KratoBot
```

### 2. Set Up the Python ML Service

```bash
cd python
pip install -r requirements.txt
```

Create a `.env` file in the `python/` directory:

```env
GEMINI_API=your_gemini_api_key
```

Start the ML service:

```bash
uvicorn ML_Services:app --host 0.0.0.0 --port 7860
```

Or with Docker:

```bash
docker build -t kratobot-ml ./python
docker run -p 7860:7860 --env-file .env kratobot-ml
```

### 3. Set Up the Backend

```bash
cd backend
npm install
```

Copy the environment template and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Kratobot
JWT_SECRET=your_jwt_secret
FRONTEND_ORIGIN=http://localhost:3000
APIFY_API=your_apify_api_token
KEYWORD_API_URL=http://127.0.0.1:7860/extract_keywords
SENTIMENT_API_URL=http://127.0.0.1:7860/analyze_sentiment
LLM_API_URL=http://127.0.0.1:7860/generate_strategy_report
SERPAPI_KEY=your_serpapi_key
```

Start the backend:

```bash
npm run dev
```

### 4. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DB_HOST` | MySQL host | Yes |
| `DB_PORT` | MySQL port | Yes |
| `DB_USER` | MySQL user | Yes |
| `DB_PASSWORD` | MySQL password | Yes |
| `DB_NAME` | MySQL database name | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `FRONTEND_ORIGIN` | Allowed CORS origin | Yes |
| `APIFY_API` | Apify API token for domain metrics | Yes |
| `GEMINI_API` | Google Gemini API key | Yes |
| `SERPAPI_KEY` | SerpAPI key for search result estimation | Optional |
| `KEYWORD_API_URL` | URL of the keyword extraction ML endpoint | Auto |
| `SENTIMENT_API_URL` | URL of the sentiment analysis ML endpoint | Auto |
| `LLM_API_URL` | URL of the LLM report generation endpoint | Auto |

---

## ML Service Endpoints

The Python FastAPI microservice exposes three endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Health check |
| `/extract_keywords` | POST | Extracts top keywords/keyphrases using KeyBERT |
| `/analyze_sentiment` | POST | Returns aggregated sentiment score (0-1) using DistilBERT |
| `/generate_strategy_report` | POST | Generates a full marketing strategy report via Gemini |

---

## Authority Score Formula

The authority score is a weighted composite (0-100 scale) of five signals:

| Signal | Weight | Max Normalization Value |
|---|---|---|
| Referring Domains | 30% | 100,000 |
| Total Backlinks | 20% | 1,000,000 |
| Domain Score | 10% | 100 |
| Keyword Count | 25% | 500 |
| Sentiment Score | 15% | 1.0 |

---

## Deployment

| Component | Recommended Platform |
|---|---|
| Backend + MySQL | [Railway](https://railway.app) |
| Frontend | [Vercel](https://vercel.com) |
| ML Service | [Railway](https://railway.app) or any Docker-compatible host |

---

## License

This project is proprietary. All rights reserved.
