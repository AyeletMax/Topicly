const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes mood from an image using Gemini Vision API
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Object>} Mood analysis result with mood, confidence, description
 */
exports.analyzeMoodWithGemini = async (imagePath) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    // Read image file
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    
    // Get file extension to determine MIME type
    const ext = imagePath.split('.').pop().toLowerCase();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    const mimeType = mimeTypes[ext] || 'image/jpeg';

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create prompt for mood analysis
    const prompt = `Analyze the mood and emotional state of the person(s) in this image. 
    
Please provide:
1. The primary mood/emotion detected (e.g., happy, sad, excited, calm, anxious, confident, tired, energetic, etc.)
2. A confidence level (0.0 to 1.0) for your assessment
3. A brief description (2-3 sentences) explaining what you observe that indicates this mood

Respond in JSON format:
{
  "mood": "the detected mood",
  "confidence": 0.0-1.0,
  "description": "your analysis description"
}`;

    // Generate content with image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let moodData;
    try {
      // Extract JSON from response (handle markdown code blocks if present)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        moodData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback: try to extract mood from text
      console.warn('Failed to parse JSON, using fallback parsing');
      const moodMatch = text.match(/mood["\s:]+([^",\n}]+)/i);
      const confidenceMatch = text.match(/confidence["\s:]+([0-9.]+)/i);
      
      moodData = {
        mood: moodMatch ? moodMatch[1].trim() : 'neutral',
        confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5,
        description: text.substring(0, 200)
      };
    }

    // Map mood to emoji
    const moodEmojiMap = {
      'happy': '😊',
      'sad': '😢',
      'excited': '🤩',
      'calm': '😌',
      'anxious': '😰',
      'confident': '😎',
      'tired': '😴',
      'energetic': '⚡',
      'neutral': '😐',
      'surprised': '😲',
      'angry': '😠',
      'peaceful': '☮️',
      'focused': '🧐',
      'playful': '😄'
    };

    const moodLower = moodData.mood.toLowerCase();
    let moodEmoji = '😊';
    for (const [key, emoji] of Object.entries(moodEmojiMap)) {
      if (moodLower.includes(key)) {
        moodEmoji = emoji;
        break;
      }
    }

    return {
      mood: moodData.mood,
      moodEmoji: moodEmoji,
      confidence: moodData.confidence || 0.5,
      description: moodData.description || 'Mood analysis completed'
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini mood analysis failed: ${error.message}`);
  }
};
