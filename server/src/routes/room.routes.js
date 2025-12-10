const express = require("express");
const router = express.Router();
const { visualizeRoomWithFurniture } = require("../controllers/room.controller");

router.post("/visualize", visualizeRoomWithFurniture);

module.exports = router;
