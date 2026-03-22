# 📦 KaggleGPT — Find the perfect dataset for your ML project

> *Describe your ML project. Get ranked datasets, notebooks & competitions from Kaggle — instantly.*

**Live demo:** [your-vercel-url.vercel.app]

---

## What it does

You describe your ML project idea in plain English. KaggleGPT:
1. Uses AI to understand your intent and generate smart Kaggle search queries
2. Searches Kaggle's real API for datasets, notebooks, and competitions in parallel
3. AI ranks every result for your specific use case with a verdict (Perfect fit / Good match / Worth checking / Skip)
4. Shows practical tips and warnings for your project type

---

## Features

- 🔍 **Real Kaggle data** — live datasets, notebooks, competitions via Kaggle API
- 🤖 **AI-powered understanding** — describes your idea in natural language, not keywords
- ⚡ **Parallel search** — datasets + notebooks + competitions fetched simultaneously
- 🏆 **AI ranking** — every result rated and explained for YOUR specific project
- 💡 **Project tips** — practical ML advice for your use case
- 📦 **Dataset metadata** — size, usability rating, vote count shown on each card
- 🔬 **Task type detection** — identifies if it's classification, NLP, CV, regression, etc.
- 📋 **Filter by type** — toggle between datasets / notebooks / competitions
- 🕐 **Search history** — last 5 searches in sidebar
- 📱 **Fully responsive** — works on mobile

---

## Project Structure

```
src/
├── config.js                 ← 🔧 ALL customisation here
│   ├── CONFIG                ← example ideas, filter chips, AI prompts
│   └── THEME                 ← colors, fonts (dark blue aesthetic)
│
├── hooks/
│   └── useSearch.js          ← all search state + orchestration
│
├── utils/
│   └── api.js                ← API helper (calls serverless function)
│
├── components/
│   ├── LandingHero.jsx       ← full-screen landing with example ideas
│   ├── SearchHeader.jsx      ← sticky search bar
│   ├── LoadingState.jsx      ← animated 3-phase loading indicator
│   ├── ResultsGrid.jsx       ← dataset/notebook/competition cards
│   └── (App.jsx)             ← main layout + history sidebar
│
api/
└── kaggle.js                 ← Vercel serverless (Kaggle + Groq calls)
```

---

## Setup

### 1. Get your free API keys

**Kaggle** (free):
- Go to [kaggle.com](https://kaggle.com) → Profile → Settings → API → Create New Token
- Downloads `kaggle.json` with your `username` and `key`

**Groq** (free):
- Go to [console.groq.com](https://console.groq.com) → API Keys → Create

### 2. Run locally

```bash
npm install

cp .env.local.example .env.local
# Fill in your Kaggle username, key, and Groq key

npm run dev
# Open http://localhost:5173
```

### 3. Deploy to Vercel

```bash
git init && git add . && git commit -m "KaggleGPT"
# Push to GitHub → import on vercel.com
```

Add these environment variables in Vercel → Settings → Environment Variables:
```
KAGGLE_USERNAME = your_kaggle_username
KAGGLE_KEY      = your_kaggle_api_key
GROQ_API_KEY    = your_groq_api_key
```

---

## Tech Stack

- React 18 + Vite
- Kaggle REST API v1 (real-time datasets, notebooks, competitions)
- Groq API — `llama-3.1-8b-instant` (free) for query generation + ranking
- Vercel serverless functions (keeps API keys server-side)
- Google Fonts — JetBrains Mono + Inter
- Zero external UI libraries

---

*Built for Thinkly Labs Software Engineering assignment.*
