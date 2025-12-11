const axios = require('axios');

exports.generateImage = async (prompt) => {
  try {
    const response = await axios.post('https://api.puter.com/v1/ai/txt2img', {
      prompt: prompt,
      model: 'dall-e-3'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return {
      success: true,
      imageUrl: response.data.url,
      imageData: response.data
    };
  } catch (error) {
    throw new Error(`Puter image generation failed: ${error.message}`);
  }
};

exports.generateRoomVisualization = async (roomDescription, furnitureDescription, styleNotes = '') => {
  const prompt = `Create a realistic room visualization: ${roomDescription} with ${furnitureDescription}. Style: ${styleNotes}. High quality, photorealistic.`;
  
  return await exports.generateImage(prompt);
};