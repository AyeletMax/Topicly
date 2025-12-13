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

    // Try multiple models in order of preference (fallback if quota exceeded)
    const modelsToTry = [
          // Better quality, may have quota limits
      'gemini-2.5-flash'   // Latest, but may have stricter quotas
    ];
    
    let currentModelIndex = 0;
    let model = genAI.getGenerativeModel({ 
      model: modelsToTry[currentModelIndex],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      }
    });
    
    console.log(`🔄 Using model: ${modelsToTry[currentModelIndex]}`);

    // Enhanced prompt that forces actual image analysis
    const prompt = `Analyze THIS SPECIFIC IMAGE. Look at the actual person(s) in the image RIGHT NOW and analyze their REAL emotional state. Do NOT give generic responses - analyze what you ACTUALLY see.

CRITICAL: You must look at the image and describe what you ACTUALLY observe. Each image is different - give a UNIQUE analysis based on what you see.

ANALYSIS STEPS:

1. LOOK AT THE IMAGE FIRST - What do you actually see?
   - Is there a person visible? How do they look?
   - What is their facial expression RIGHT NOW?
   - What is their body position?
   - What is the context/setting?

2. ANALYZE FACIAL FEATURES (be specific to THIS image):
   - Eyes: Are they wide open, half-closed, looking up/down/away? Any wrinkles?
   - Mouth: Is it smiling, frowning, neutral? Are corners up or down?
   - Eyebrows: Raised, furrowed, relaxed?
   - Overall face: Tense, relaxed, expressive, blank?

3. ANALYZE BODY LANGUAGE (specific to THIS image):
   - Posture: How is the person positioned?
   - Shoulders: Raised, relaxed, forward?
   - Head: Position and angle?
   - Arms/hands: What are they doing?

4. DETERMINE MOOD (choose ONE that matches what you ACTUALLY see):
   - happy: visible smile, bright eyes, positive expression
   - sad: downturned mouth, droopy eyes, negative expression
   - excited: wide eyes, big smile, energetic pose
   - calm: relaxed face, peaceful expression, composed
   - anxious: tense face, worried expression, nervous body language
   - confident: strong posture, direct gaze, self-assured expression
   - tired: droopy eyes, relaxed/slumped posture, weary expression
   - energetic: active pose, bright expression, dynamic body language
   - neutral: minimal expression, balanced, neither positive nor negative

5. CONFIDENCE (0.0-1.0):
   - How clear and obvious is the emotion in THIS specific image?
   - 0.9-1.0: Very obvious, clear expression
   - 0.7-0.8: Clear but some ambiguity
   - 0.5-0.6: Moderate clarity
   - 0.3-0.4: Unclear, ambiguous
   - 0.0-0.2: Very unclear

6. DESCRIPTION:
   Write 2-3 sentences describing SPECIFICALLY what you see in THIS image that indicates the mood. Be concrete and specific - mention actual features you observe.

IMPORTANT: 
- Analyze THIS specific image, not a generic person
- Give a UNIQUE response based on what you ACTUALLY see
- If the image shows multiple people, analyze the most prominent/central person
- If no person is clearly visible, return mood: "neutral", confidence: 0.3

OUTPUT FORMAT - JSON only, no other text:
{
  "mood": "one_word_from_list",
  "confidence": 0.0-1.0,
  "description": "specific description of what you see in this image"
}`;

    // Generate content with image - with retry logic for quota errors
    let result;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          }
        ]);
        break; // Success, exit loop
      } catch (apiError) {
        attempts++;
        
        // Check if it's a quota error
        const isQuotaError = apiError.message && (
          apiError.message.includes('429') || 
          apiError.message.includes('quota') || 
          apiError.message.includes('Quota') ||
          apiError.message.includes('exceeded')
        );
        
        if (isQuotaError) {
          console.warn(`⚠️ Quota exceeded for model ${modelsToTry[currentModelIndex]} (attempt ${attempts}/${maxAttempts})`);
          
          // Try next model in list if available
          if (currentModelIndex < modelsToTry.length - 1) {
            currentModelIndex++;
            const nextModel = modelsToTry[currentModelIndex];
            console.log(`🔄 Switching to model: ${nextModel}`);
            model = genAI.getGenerativeModel({ 
              model: nextModel,
              generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                topK: 40,
              }
            });
            attempts = 0; // Reset attempts for new model
            continue; // Retry with new model
          }
          
          // All models exhausted - extract retry delay from error
          const retryMatch = apiError.message.match(/retry in ([\d.]+)s/i) || apiError.message.match(/(\d+\.?\d*)\s*seconds?/i);
          const retrySeconds = retryMatch ? parseFloat(retryMatch[1]) : 60;
          
          throw new Error(`Quota exceeded for all models. You've used your daily free tier limit (20 requests per model). Please wait ${Math.ceil(retrySeconds)} seconds or upgrade your plan at https://ai.google.dev/pricing`);
        }
        
        // For other errors, throw immediately
        throw apiError;
      }
    }
    
    if (!result) {
      throw new Error('Failed to generate content after multiple attempts');
    }

    const response = await result.response;
    const text = response.text();
    
    // Log the raw response for debugging
    console.log('📝 Raw Gemini response:', text.substring(0, 300));

    // Parse JSON response
    let moodData;
    try {
      // Try to find JSON in response - handle various formats
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        moodData = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed mood data:', moodData);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('Full response text:', text);
      
      // Enhanced fallback parsing
      const moodMatch = text.match(/["']?mood["']?\s*[:=]\s*["']?([^",\n}]+)["']?/i);
      const confidenceMatch = text.match(/["']?confidence["']?\s*[:=]\s*([0-9.]+)/i);
      const descMatch = text.match(/["']?description["']?\s*[:=]\s*["']?([^"]+)["']?/i);
      
      moodData = {
        mood: moodMatch ? moodMatch[1].trim().toLowerCase() : 'neutral',
        confidence: confidenceMatch ? Math.min(1.0, Math.max(0.0, parseFloat(confidenceMatch[1]))) : 0.5,
        description: descMatch ? descMatch[1].trim() : (text.substring(0, 200) || 'Unable to analyze image')
      };
      
      console.warn('⚠️ Using fallback parsing, mood:', moodData.mood);
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

/**
 * Get 3 YouTube song links for a given mood, tailored for the Haredi (חרדי) community.
 * @param {string} mood - The mood (in Hebrew or English)
 * @returns {Promise<string[]>} Array of YouTube links (as strings). Returns empty array if none found.
 */
exports.getHarediSongsByMoodWithGemini = async (mood) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    // Use the latest Gemini text model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    });

    const prompt = `
Give me 3 direct YouTube links to songs by Yaakov Shwekey that fit the mood: ${mood} and are 100% appropriate for the Haredi (ultra-Orthodox Jewish) community.
Only provide full valid YouTube links in the following format, with nothing else:
https://www.youtube.com/watch?v=XXXXXXXXXXX
No explanations, no song titles, no extra words. Just three valid YouTube URLs, one on each line.
Only include videos that are definitely by Yaakov Shwekey!`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // חיתוך הקישורים מתוך הטקסט, יתפוס הפורמט שמתחיל בקישור יוטיוב בלבד בכל שורה
    const youtubeLinks = [];
    const lines = text.split('\n');
    for (const line of lines) {
      // חפש שורה שמתחילה בקישור יוטיוב או מכילה קישור ביוטיוב
      const match = line.match(/(https?:\/\/(www\.)?youtube\.com\S+|https?:\/\/youtu\.be\S+)/i);
      if (match) youtubeLinks.push(match[0]);
    }
    return youtubeLinks.slice(0, 3); // תחזיר עד 3 קישורים בלבד
  } catch (error) {
    console.error('Gemini Haredi Songs Error:', error);
    return [];
  }
};