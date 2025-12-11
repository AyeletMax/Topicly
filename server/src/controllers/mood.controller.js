const { analyzeMoodWithGemini } = require('../services/gemini.service');
const { getMoodLinks } = require('../utils/moodLinks');
const fs = require('fs');
const path = require('path');

exports.analyzeMood = async (req, res) => {
  try {
    console.log('🔍 Request received for mood analysis');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    console.log('✅ Image received:', req.file.filename);

    // Analyze mood using Gemini Vision API
    console.log('🤖 Analyzing mood with Gemini Vision...');
    const moodAnalysis = await analyzeMoodWithGemini(imagePath);
    
    console.log('✅ Mood analysis completed:', moodAnalysis.mood);

    // Get recommended links based on mood
    const links = getMoodLinks(moodAnalysis.mood, moodAnalysis.confidence);

    // Clean up uploaded file
    fs.unlinkSync(imagePath);
    console.log('🗑️ Uploaded file cleaned up');

    // Prepare response
    const response = {
      success: true,
      mood: moodAnalysis.mood,
      moodEmoji: moodAnalysis.moodEmoji,
      confidence: moodAnalysis.confidence,
      description: moodAnalysis.description,
      links: links
    };

    console.log('📤 Sending response...');
    res.json(response);
  } catch (err) {
    console.error('❌ Error:', err);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Mood analysis failed',
      message: err.message
    });
  }
};

