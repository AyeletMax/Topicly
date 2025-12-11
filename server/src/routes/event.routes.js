const express = require("express");
const router = express.Router();
const { generateContent, generateEventImage } = require("../controllers/event.controller");

router.post("/generate", generateContent);
router.post("/generate-image", generateEventImage);

module.exports = router;
