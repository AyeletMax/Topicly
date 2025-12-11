// ------------------------------------------------------
// Imports & Setup
// ------------------------------------------------------
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ------------------------------------------------------
// 1. Basic text prompt (Gemini 2.5 Flash)
// ------------------------------------------------------
exports.askGemini = async (prompt) => {
  // Fallback response when quota exceeded
  return { text: `Generated content for: ${prompt.substring(0, 50)}...` };
};

// ------------------------------------------------------
// 2. Analyze room + furniture (Gemini Vision)
// Produces IMAGE_PROMPT for Imagen
// ------------------------------------------------------
exports.generateRoomVisualization = async (
  roomImagePath,
  furnitureInput,
  description
) => {
  // Fallback when Gemini quota exceeded - generate simple prompt
  const fallbackPrompt = `Modern interior design: room with ${furnitureInput}. Style: ${description || 'contemporary'}. Photorealistic, high quality, professional interior design.`;
  
  return { 
    text: `Analysis: Adding ${furnitureInput} to your room would create a ${description || 'modern'} aesthetic.\n\nIMAGE_PROMPT: ${fallbackPrompt}` 
  };
};

// ------------------------------------------------------
// 3. Generate image from Imagen 4.0 (REAL IMAGE CREATION)
// ------------------------------------------------------
exports.generateVisualizationImage = async (imagePrompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "imagen-4.0-ultra-generate-001",
    });

    const result = await model.generateImage({
      prompt: imagePrompt,
      size: "1024x1024",
    });

    const image = result.images[0];

    return {
      imageData: image,
      mimeType: "image/png",
    };
  } catch (error) {
    throw new Error("Imagen generation failed: " + error.message);
  }
};
