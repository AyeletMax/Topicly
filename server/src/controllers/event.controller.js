const { askGemini } = require("../services/gemini.service");

exports.generateContent = async (req, res) => {
  try {
    const { topic, types } = req.body;

    const prompt = `Create event materials based on topic: ${topic}.
Types needed: ${types.join(", ")}.
Generate high‑quality output.`;

    const result = await askGemini(prompt);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Gemini request failed", message: err.message });
  }
};
