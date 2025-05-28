# Quotes App

Application that displays random quotes from FavQs API.

## Setup

### Prerequisites
- Node.js (v18+)
- FavQs API key from https://favqs.com/api

### Backend
```bash
cd backend
npm install

# Create .env file with:
# PORT=4000
# FAVQS_API_KEY=your_api_key_here
# FAVQS_API_URL=https://favqs.com/api

npm run dev          # Runs on http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm start           # Runs on http://localhost:3000
```

### Tests
```bash
# In backend/ or frontend/
npm test
```

## Features
- Get 1-50 random quotes
- Filter by tags
- Error handling & rate limiting

## API

GET `/api/quotes?count=5&tag=love`
- `count`: 1-50 quotes (default: 1)
- `tag`: optional filter 