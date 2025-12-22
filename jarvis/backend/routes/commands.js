// server/routes/commands.js
const express = require('express');
const router = express.Router();
const Command = require('../models/Command');

// Get all commands
router.get('/', async (req, res) => {
  try {
    const commands = await Command.find();
    res.json(commands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new command
router.post('/', async (req, res) => {
  const command = new Command({
    name: req.body.name,
    action: req.body.action,
    description: req.body.description
  });

  try {
    const newCommand = await command.save();
    res.status(201).json(newCommand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
