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
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return { text: result.response.text() };
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
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  // load room image
  const roomImageBuffer = fs.readFileSync(roomImagePath);
  const roomBase64 = roomImageBuffer.toString("base64");

  const parts = [
    {
      inlineData: {
        data: roomBase64,
        mimeType: "image/jpeg",
      },
    },
  ];

  // If furniture is an image
  if (furnitureInput && furnitureInput.startsWith("/")) {
    const furnitureBuffer = fs.readFileSync(furnitureInput);
    const furnitureBase64 = furnitureBuffer.toString("base64");

    parts.push({
      inlineData: {
        data: furnitureBase64,
        mimeType: "image/jpeg",
      },
    });

    parts.push({
      text: `
Analyze both images and provide design insights.
Then output "IMAGE_PROMPT:" followed by a detailed photorealistic prompt.
Style: ${description || "Interior design professional"}
`,
    });
  } else {
    // Furniture as text
    parts.push({
      text: `
Room image loaded.
Furniture: ${furnitureInput}

Provide:
• Space fit analysis
• Colors
• Lighting
• Placement suggestions

Then output "IMAGE_PROMPT:" with an Imagen-ready prompt.
`,
    });
  }

  const result = await model.generateContent(parts);
  return { text: result.response.text() };
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
