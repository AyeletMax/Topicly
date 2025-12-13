const express = require('express');
const router = express.Router();
const moodController = require('../controllers/mood.controller');

module.exports = (upload) => {
  router.post('/analyze-mood', upload.single('image'), moodController.analyzeMood);
  router.get('/haredi-songs', moodController.getHarediSongs);
  return router;
};

