
import { GoogleGenAI } from '@google/genai';
import dotenv from "dotenv";
dotenv.config();

// Initialize the AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
  // Generate content
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Why is the sky blue?',
  });

  console.log(response.text);
}

main();