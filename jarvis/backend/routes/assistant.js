// server/routes/assistant.js
const express = require('express');
const router = express.Router();
const { assistantService } = require('../services/assistant-service');

// Process speech
router.post('/process-speech', async (req, res) => {
  try {
    const { audio } = req.body;
    const response = await assistantService.processSpeech(audio);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
