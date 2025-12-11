# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

## Step 2: Configure Environment

Create `server/.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

Get your API key from: https://aistudio.google.com/app/apikey

## Step 3: Run the Application

### Option A: With Docker (Recommended)
```bash
# From project root
docker-compose up --build
```

Access:
- Frontend: http://localhost
- Backend: http://localhost:3001

### Option B: Local Development

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Step 4: Test

```bash
cd server
npm test
```

## Troubleshooting

1. **Gemini API Error**: Make sure your API key is correct in `server/.env`
2. **Port already in use**: Change PORT in `.env` or stop other services
3. **Docker build fails**: Make sure Docker is running and you have enough resources

