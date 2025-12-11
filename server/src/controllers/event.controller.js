const { askGemini } = require("../services/gemini.service");
const { generateImage } = require("../services/puter.service");

exports.generateContent = async (req, res) => {
  try {
    const { topic, types } = req.body;

    // Fallback response without Gemini
    const result = {
      text: `Event materials for ${topic}:\n\n${types.map(type => `• ${type.charAt(0).toUpperCase() + type.slice(1)}: Professional ${type} for ${topic} event`).join('\n')}`
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Content generation failed", message: err.message });
  }
};

exports.generateEventImage = async (req, res) => {
  try {
    const { description } = req.body;
    
    const result = await generateImage(description);
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Image generation failed", message: err.message });
  }
};
