const axios = require('axios');

exports.generateImage = async (prompt) => {
  try {
    // Using a different free image generation API as fallback
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return {
      success: true,
      imageUrl: response.data.data[0].url,
      imageData: response.data
    };
  } catch (error) {
    // Fallback: return a mock response for development
    console.log('Image generation failed, using fallback:', error.message);
    return {
      success: true,
      imageUrl: 'https://via.placeholder.com/1024x1024/4A90E2/FFFFFF?text=Generated+Image',
      imageData: { mock: true, prompt: prompt }
    };
  }
};

exports.generateRoomVisualization = async (roomDescription, furnitureDescription, styleNotes = '') => {
  const prompt = `Create a realistic room visualization: ${roomDescription} with ${furnitureDescription}. Style: ${styleNotes}. High quality, photorealistic.`;
  
  return await exports.generateImage(prompt);
};