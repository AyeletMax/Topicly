# 🎭 Mood Analyzer - AI-Powered Mood Detection

A production-ready web application that analyzes human emotions from images using Google Gemini Vision API and provides personalized content recommendations based on detected mood.

## 🎯 Project Overview

This is a full-stack application built as a final project that demonstrates:
- **AI Integration**: Deep integration with Google Gemini Vision API for mood analysis
- **Modern Frontend**: React-based user interface with beautiful UX
- **Robust Backend**: Node.js/Express server with proper error handling
- **Docker Support**: Full containerization for easy deployment
- **Testing**: Unit and integration tests
- **CI/CD Ready**: Structured for continuous integration/deployment

## ✨ Features

- 📸 **Image Upload**: Upload photos to analyze mood
- 🤖 **AI Mood Detection**: Powered by Google Gemini Vision API
- 🎯 **Personalized Recommendations**: Get curated links (music, videos, articles) based on your mood
- 📊 **Confidence Scoring**: See how confident the AI is in its analysis
- 🎨 **Beautiful UI**: Modern, responsive design
- 🐳 **Dockerized**: Run everything in containers
- ✅ **Tested**: Comprehensive test coverage

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │─────────▶│  Express    │─────────▶│   Gemini    │
│  Frontend   │  HTTP    │   Backend   │   API    │  Vision API │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │  Mood Links │
                        │   Mapper    │
                        └─────────────┘
```

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd Topicly

# Create .env file for server
cd server
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 2. Environment Variables

Create `server/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. Run with Docker (Recommended)

```bash
# From project root
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3001

### 4. Run Locally (Development)

**Backend:**
```bash
cd server
npm install
npm start
```

**Frontend:**
```bash
cd client
npm install
npm start
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd client
npm test
```

## 📁 Project Structure

```
Topicly/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── MoodAnalyzer.js
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── mood.controller.js
│   │   ├── routes/
│   │   │   └── mood.routes.js
│   │   ├── services/
│   │   │   └── gemini.service.js
│   │   ├── utils/
│   │   │   └── moodLinks.js
│   │   └── server.js
│   ├── __tests__/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔧 API Endpoints

### POST `/api/analyze-mood`
Analyzes mood from uploaded image.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "success": true,
  "mood": "happy",
  "moodEmoji": "😊",
  "confidence": 0.85,
  "description": "The person appears happy and cheerful...",
  "links": [
    {
      "title": "Upbeat Music Playlist",
      "url": "https://...",
      "type": "Music",
      "icon": "🎵"
    }
  ]
}
```

## 🐳 Docker Details

### Build Images
```bash
docker-compose build
```

### Run Containers
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Containers
```bash
docker-compose down
```

## 🧩 Technology Stack

**Frontend:**
- React 18
- Axios
- CSS3 (Modern styling)

**Backend:**
- Node.js 18
- Express.js
- Multer (File uploads)
- Google Generative AI SDK
- Jest (Testing)

**DevOps:**
- Docker
- Docker Compose
- Nginx (Production frontend)

## 📊 AI Integration Flow

1. User uploads image → Frontend sends to Backend
2. Backend receives image → Converts to base64
3. Backend calls Gemini Vision API → Analyzes mood
4. Gemini returns mood analysis → Backend processes
5. Backend maps mood to links → Returns to Frontend
6. Frontend displays mood + recommendations

## 🎓 Project Requirements Compliance

✅ **AI Component**: Deep Gemini Vision API integration  
✅ **Web Application**: Modern React frontend  
✅ **Backend**: Node.js/Express with proper architecture  
✅ **Testing**: Unit tests for backend utilities  
✅ **Docker**: Full containerization  
✅ **CI/CD Ready**: Structured for pipelines  

## 📝 License

This project is part of a final project submission.

## 👥 Authors

[Your Name/Team Name]

## 🙏 Acknowledgments

- Google Gemini API for mood analysis capabilities
- React and Node.js communities

---

**Built with ❤️ for final project submission**

