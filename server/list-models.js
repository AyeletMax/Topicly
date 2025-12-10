const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAvailableModels() {
  try {
    console.log('🔍 Fetching available models from Google Generative AI API...\n');
    const response = await genAI.listModels();
    
    console.log('✅ Available Models:');
    console.log('='.repeat(60));
    
    response.models.forEach((model, index) => {
      console.log(`${index + 1}. ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Description: ${model.description}`);
      console.log('');
    });
    
    console.log('='.repeat(60));
    console.log(`\nTotal models available: ${response.models.length}`);
  } catch (error) {
    console.error('❌ Error fetching models:', error.message);
  }
}

listAvailableModels();
