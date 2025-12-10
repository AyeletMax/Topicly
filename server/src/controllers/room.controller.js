const { generateRoomVisualization, generateVisualizationImage } = require("../services/gemini.service");
const fs = require('fs');
const path = require('path');

exports.visualizeRoomWithFurniture = async (req, res) => {
  try {
    console.log('🔍 Request received for room visualization');
    console.log('Files received:', req.files ? Object.keys(req.files) : 'None');
    console.log('Body:', req.body);

    const { furnitureDescription } = req.body;
    
    // Check if room image was uploaded
    if (!req.files || !req.files.roomImage) {
      console.log('❌ Room image is missing');
      return res.status(400).json({ error: "Room image is required" });
    }

    console.log('✅ Room image received');

    const roomImageFile = req.files.roomImage;
    const roomImagePath = path.join(__dirname, '../../uploads', roomImageFile.name);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('📁 Created uploads directory');
    }

    // Save room image
    await roomImageFile.mv(roomImagePath);
    console.log('💾 Room image saved');

    let furnitureImagePath = null;

    // Check if furniture image was uploaded
    if (req.files && req.files.furnitureImage) {
      const furnitureImageFile = req.files.furnitureImage;
      furnitureImagePath = path.join(uploadsDir, furnitureImageFile.name);
      await furnitureImageFile.mv(furnitureImagePath);
      console.log('💾 Furniture image saved');
    }

    // Step 1: Generate visualization description and image prompt
    console.log('🤖 Generating visualization analysis...');
    const analysisResult = await generateRoomVisualization(
      roomImagePath,
      furnitureImagePath || furnitureDescription,
      req.body.description || ""
    );

    console.log('✅ Analysis completed');

    // Extract image prompt from the analysis
    const analysisText = analysisResult.text;
    const imagePromptMatch = analysisText.match(/IMAGE_PROMPT:\s*([\s\S]*?)(?=\n\n|\Z)/i);
    const imagePrompt = imagePromptMatch ? imagePromptMatch[1].trim() : analysisText;

    console.log('📸 Image prompt extracted');
    console.log('Prompt:', imagePrompt.substring(0, 100) + '...');

    // Step 2: Generate visualization image using Gemini
    let generatedImage = null;
    let imageBase64 = null;
    
    try {
      console.log('🎨 Generating image using Gemini...');
      const imageResult = await generateVisualizationImage(imagePrompt);
      
      if (imageResult && imageResult.imageData) {
        generatedImage = imageResult;
        imageBase64 = imageResult.imageData;
        console.log('✅ Image generated successfully');
      } else if (imageResult && imageResult.text) {
        console.log('⚠️ Got text response instead of image:', imageResult.text.substring(0, 100));
      }
    } catch (imageError) {
      console.error('❌ Image generation error:', imageError.message);
      // Continue without image if generation fails
    }

    // Clean up uploaded files
    fs.unlinkSync(roomImagePath);
    if (furnitureImagePath && fs.existsSync(furnitureImagePath)) {
      fs.unlinkSync(furnitureImagePath);
    }

    // Prepare response
    const responseData = {
      success: true,
      analysis: analysisText,
      imagePrompt: imagePrompt,
    };

    if (imageBase64) {
      responseData.visualizationImage = {
        data: imageBase64,
        mimeType: generatedImage.mimeType,
      };
    }

    console.log('📤 Sending response...');
    res.json(responseData);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ 
      error: "Furniture visualization failed", 
      message: err.message 
    });
  }
};
