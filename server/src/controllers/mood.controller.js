const { analyzeMoodWithGemini } = require('../services/gemini.service');
const { getMoodLinks } = require('../utils/moodLinks');
const { getHarediSongsByMoodWithGemini } = require('../services/gemini.service');
const fs = require('fs');
const path = require('path');

/**
 * Controller: Get Haredi-friendly YouTube songs by mood (text input)
 * @route GET /haredi-songs?mood=...
 */
exports.getHarediSongs = async (req, res) => {
  try {
    const mood = req.query.mood || 'happy';
    const links = await getHarediSongsByMoodWithGemini(mood);
    res.json({ mood, links });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update analyzeMood to not use getMoodLinks
exports.analyzeMood = async (req, res) => {
  try {
    console.log('🔍 Request received for mood analysis');
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const imagePath = req.file.path;
    console.log('✅ Image received:', req.file.filename);
    let moodAnalysis;
    try {
      // Analyze with Gemini Vision API
      console.log('🤖 Analyzing mood with Gemini Vision...');
      console.log('📸 Image file:', req.file.filename, 'Size:', req.file.size, 'bytes');
      moodAnalysis = await analyzeMoodWithGemini(imagePath);
      console.log('✅ Mood analysis completed:');
      console.log('   - Mood:', moodAnalysis.mood);
      console.log('   - Confidence:', moodAnalysis.confidence);
      console.log('   - Description length:', moodAnalysis.description?.length || 0);
    } catch (geminiError) {
      console.error('❌ Gemini analysis failed:', geminiError.message);
      throw new Error(`Failed to analyze image: ${geminiError.message}. Please check your GEMINI_API_KEY and try again.`);
    }
    // instead of getMoodLinks, ALWAYS get Gemini songs only:
    const links = await getHarediSongsByMoodWithGemini(moodAnalysis.mood);
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