// models/Command.js
const mongoose = require('mongoose');

const CommandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  action: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Command', CommandSchema);
