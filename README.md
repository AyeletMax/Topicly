# Topicly - Room Furniture Visualizer

A web application that helps users visualize how furniture would look in their room using AI-powered image generation.

## Features

✨ **Room Upload** - Upload an image of your room  
🛋️ **Furniture Input** - Either describe furniture or upload an image  
🤖 **AI Visualization** - Uses Google Gemini API to generate realistic visualizations  
💭 **Custom Details** - Add style preferences and additional notes  
📱 **Responsive Design** - Works on desktop and mobile devices  

## Project Structure

```
Topicly/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoomVisualizer.js
│   │   │   └── RoomVisualizer.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── event.controller.js
│   │   │   └── room.controller.js
│   │   ├── routes/
│   │   │   ├── event.routes.js
│   │   │   └── room.routes.js
│   │   └── services/
│   │       └── gemini.service.js
│   ├── server.js
│   └── package.json
└── docker-compose.yml
```

## Installation & Setup

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```

4. Start the server:
```bash
npm start
```
The server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```
The frontend will run on `http://localhost:3000`

## API Endpoints

### Room Visualization

**POST** `/api/rooms/visualize`

**Request (multipart/form-data):**
- `roomImage` - Room image file (required)
- `furnitureImage` - Furniture image file (optional)
- `furnitureDescription` - Text description of furniture (required if no image)
- `description` - Additional style notes (optional)

**Response:**
```json
{
  "success": true,
  "visualization": "AI-generated description of how the furniture would look in the room"
}
```

## How to Use

1. **Upload Room Image** - Click to upload a photo of your room
2. **Choose Furniture Input** - Either describe the furniture or upload an image
3. **Add Optional Details** - Specify style preferences (modern, minimalist, etc.)
4. **Generate** - Click "Generate Visualization" to see the result
5. **Review** - The AI will generate a detailed visualization

## Technologies Used

**Frontend:**
- React 18
- Axios
- CSS3 with animations

**Backend:**
- Node.js & Express
- Google Generative AI
- express-fileupload

## Requirements

- Node.js v14+
- Google Gemini API key (get it from [Google AI Studio](https://aistudio.google.com/))
- Modern web browser

## Environment Variables

### Server `.env`
```env
GEMINI_API_KEY=your_gemini_api_key
```

## Running with Docker

```bash
docker-compose up
```

## License

This project is part of the Topicly initiative by AyeletMax.
