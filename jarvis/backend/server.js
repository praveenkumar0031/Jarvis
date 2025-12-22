// server.js
const express = require('express');
const mongoose = require('mongoose');  // Make sure this is here
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (updated for newer MongoDB versions)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jarvisDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Import Routes
const assistantRoutes = require('./routes/assistant');
// If you have other route files, import them here

// Use Routes
app.use('/api/assistant', assistantRoutes);
// Register other routes if you have them

// Socket.io setup for real-time communication
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('speech', async (data) => {
    try {
      // Process the speech data
      const { assistantService } = require('./services/assistant-service');
      const response = await assistantService.processSpeech(data);
      
      socket.emit('response', response);
    } catch (error) {
      console.error('Error processing speech:', error);
      socket.emit('error', { message: 'Error processing speech' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
