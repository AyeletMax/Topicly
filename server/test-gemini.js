const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    console.log('🧪 Testing Gemini API...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Say hello in Hebrew");
    console.log('✅ Gemini API works!');
    console.log('Response:', result.response.text());
  } catch (error) {
    console.log('❌ Gemini API error:', error.message);
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('🔑 API Key is invalid');
    } else if (error.message.includes('quota')) {
      console.log('📊 Quota exceeded');
    }
  }
}

testGemini();