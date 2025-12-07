const express = require("express");
const router = express.Router();
const { generateContent } = require("../controllers/event.controller");

router.post("/generate", generateContent);

module.exports = router;
