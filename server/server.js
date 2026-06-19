import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/auth.js';
import assignmentRoutes from './routes/assignments.js';
import announcementRoutes from './routes/announcements.js';
import eventRoutes from './routes/events.js';
import messageRoutes from './routes/messages.js';
import materialRoutes from './routes/materials.js';
import uploadRoutes from './routes/upload.js';
import downloadRoutes from './routes/download.js';
import profileRoutes from './routes/profile.js';
import usersRoutes from './routes/users.js';
import directMessagesRoutes from './routes/directMessages.js';
import noticesRoutes from './routes/notices.js';
import teachersRoutes from './routes/teachers.js';
import Message from './models/Message.js';
import User from './models/User.js';
import DirectMessage from './models/DirectMessage.js';

dotenv.config();

// Debug: Check if env variables are loaded
console.log('Environment check:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Linkbridge API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/auth/profile', profileRoutes);
app.use('/api/auth/users', usersRoutes);
app.use('/api/direct-messages', directMessagesRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/teachers', teachersRoutes);

// Socket.io for real-time chat
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log('Socket connection without token');
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    console.log('Socket auth error:', err.message);
    next();
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id, socket.userId || 'anonymous');

  // Join user's personal room for direct messages
  if (socket.userId) {
    socket.join(`user-${socket.userId}`);
  }

  socket.on('join-chat', (room) => {
    socket.join(room || 'general');
    console.log(`User ${socket.userId} joined room: ${room || 'general'}`);
  });

  socket.on('send-message', async (data) => {
    try {
      const user = await User.findById(socket.userId);
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      const message = new Message({
        sender: socket.userId,
        content: data.content,
        attachments: data.attachments || [],
        department: data.department,
        semester: data.semester,
        isGeneral: data.isGeneral !== false
      });
      
      await message.save();
      await message.populate('sender', 'name avatar role');
      
      io.emit('new-message', message);
    } catch (error) {
      console.error('Message error:', error);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('send-direct-message', async (data) => {
    try {
      const user = await User.findById(socket.userId);
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      const directMessage = new DirectMessage({
        sender: socket.userId,
        receiver: data.receiver,
        content: data.content,
        attachments: data.attachments || []
      });
      
      await directMessage.save();
      await directMessage.populate('sender', 'name avatar role');
      await directMessage.populate('receiver', 'name avatar role');
      
      // Emit to both sender and receiver
      io.to(`user-${socket.userId}`).emit('new-direct-message', directMessage);
      io.to(`user-${data.receiver}`).emit('new-direct-message', directMessage);
    } catch (error) {
      console.error('Direct message error:', error);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
