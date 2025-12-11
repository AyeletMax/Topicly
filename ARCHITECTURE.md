# 🏗️ System Architecture

## Overview

Mood Analyzer is a full-stack web application that uses Google Gemini Vision API to analyze human emotions from images and provide personalized content recommendations.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Frontend (Port 3000/80)                │  │
│  │  - MoodAnalyzer Component                            │  │
│  │  - Image Upload UI                                   │  │
│  │  - Results Display                                   │  │
│  └──────────────────┬───────────────────────────────────┘  │
└──────────────────────┼──────────────────────────────────────┘
                       │ HTTP POST (multipart/form-data)
                       │ Image File
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Node.js/Express Backend (Port 3001)            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes Layer                                         │  │
│  │  - POST /api/analyze-mood                             │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │  Controllers Layer                                    │  │
│  │  - mood.controller.js                                 │  │
│  │    • File upload handling                            │  │
│  │    • Error handling                                   │  │
│  │    • Response formatting                              │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │  Services Layer                                      │  │
│  │  - gemini.service.js                                 │  │
│  │    • Image to base64 conversion                       │  │
│  │    • Gemini API integration                          │  │
│  │    • Mood parsing & emoji mapping                    │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │  Utils Layer                                         │  │
│  │  - moodLinks.js                                      │  │
│  │    • Mood to links mapping                           │  │
│  │    • Content recommendations                          │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS API Call
                       │ Image + Prompt
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           Google Gemini Vision API                           │
│  - Model: gemini-pro-vision                                  │
│  - Input: Base64 image + text prompt                        │
│  - Output: JSON with mood, confidence, description          │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User Upload**: User selects and uploads an image through React UI
2. **Frontend → Backend**: Image sent as multipart/form-data to `/api/analyze-mood`
3. **File Storage**: Multer saves image temporarily to `server/uploads/`
4. **Image Processing**: Image converted to base64 with proper MIME type
5. **Gemini API Call**: 
   - Image + prompt sent to Gemini Vision API
   - Prompt requests mood analysis in JSON format
6. **Response Parsing**: 
   - Extract mood, confidence, description from Gemini response
   - Map mood to emoji
7. **Link Generation**: 
   - Use moodLinks utility to get relevant content links
   - Adjust number of links based on confidence
8. **Cleanup**: Delete temporary image file
9. **Response**: Return JSON with mood data and links to frontend
10. **UI Display**: React component displays mood badge, description, and clickable links

## Technology Stack

### Frontend
- **React 18**: UI framework
- **Axios**: HTTP client
- **CSS3**: Modern styling with gradients and animations
- **Nginx**: Production web server (Docker)

### Backend
- **Node.js 18**: Runtime
- **Express.js**: Web framework
- **Multer**: File upload handling
- **Google Generative AI SDK**: Gemini API client
- **Jest**: Testing framework

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **GitHub Actions**: CI/CD pipeline

## Security Considerations

1. **API Key**: Stored in environment variables, never committed
2. **File Upload**: 
   - File type validation (images only)
   - File size limits (10MB)
   - Temporary storage with cleanup
3. **CORS**: Configured for frontend origin
4. **Error Handling**: No sensitive data in error messages

## Scalability

- **Stateless Design**: No session storage, each request independent
- **Containerized**: Easy horizontal scaling with Docker
- **API Rate Limiting**: Can be added via middleware
- **File Cleanup**: Automatic cleanup prevents disk space issues

## Future Enhancements

- Caching for repeated mood analyses
- User authentication and history
- Multiple image batch processing
- Real-time mood tracking over time
- Integration with music/video streaming APIs

