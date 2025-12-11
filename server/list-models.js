const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  const modelsToTry = [
    "gemini-pro",
    "gemini-1.5-pro", 
    "gemini-1.5-flash",
    "gemini-pro-vision"
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`🧪 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`✅ ${modelName} works!`);
      console.log(`Response: ${result.response.text()}`);
      break;
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}`);
    }
  }
}

testModels();