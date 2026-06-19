import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Create log file
const logStream = fs.createWriteStream('server-debug.log', { flags: 'a' });
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  logStream.write(logMessage);
};

log('=== SERVER STARTING ===');
log('Environment variables:');
log(`MONGODB_URI: ${process.env.MONGODB_URI}`);
log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);
log(`PORT: ${process.env.PORT}`);

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  log('Test route hit');
  res.json({ message: 'Server is running' });
});

// MongoDB connection
log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    log('✓ MongoDB connected successfully');
    
    // Import routes after DB connection
    import('./routes/auth.js').then(authModule => {
      log('✓ Auth routes loaded');
      app.use('/api/auth', authModule.default);
      
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        log(`✓ Server running on port ${PORT}`);
        log('=== SERVER READY ===');
      });
    }).catch(err => {
      log(`✗ Error loading routes: ${err.message}`);
      log(err.stack);
    });
  })
  .catch(err => {
    log(`✗ MongoDB connection error: ${err.message}`);
    log(err.stack);
    process.exit(1);
  });

// Global error handler
process.on('uncaughtException', (err) => {
  log(`✗ UNCAUGHT EXCEPTION: ${err.message}`);
  log(err.stack);
});

process.on('unhandledRejection', (err) => {
  log(`✗ UNHANDLED REJECTION: ${err.message}`);
  log(err.stack);
});
