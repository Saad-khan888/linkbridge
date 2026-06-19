import express from 'express';
import DirectMessage from '../models/DirectMessage.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all conversations for current user
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const messages = await DirectMessage.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
    .populate('sender', 'name avatar role')
    .populate('receiver', 'name avatar role')
    .sort('-createdAt');

    // Get unique users
    const usersMap = new Map();
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user._id.toString() 
        ? msg.receiver 
        : msg.sender;
      
      if (!usersMap.has(otherUser._id.toString())) {
        usersMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0
        });
      }
    });

    // Count unread messages
    for (const [userId, data] of usersMap) {
      const unreadCount = await DirectMessage.countDocuments({
        sender: userId,
        receiver: req.user._id,
        isRead: false
      });
      data.unreadCount = unreadCount;
    }

    const conversations = Array.from(usersMap.values());
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages with specific user
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const messages = await DirectMessage.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'name avatar role')
    .populate('receiver', 'name avatar role')
    .sort('createdAt');

    // Mark messages as read
    await DirectMessage.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send direct message
router.post('/', authenticate, async (req, res) => {
  try {
    const message = new DirectMessage({
      sender: req.user._id,
      receiver: req.body.receiver,
      content: req.body.content,
      attachments: req.body.attachments || []
    });

    await message.save();
    await message.populate('sender', 'name avatar role');
    await message.populate('receiver', 'name avatar role');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users for messaging with role-based filtering
router.get('/users/list', authenticate, async (req, res) => {
  try {
    const { type } = req.query; // 'students', 'teachers', or 'admins'
    let query = { isActive: true, _id: { $ne: req.user._id } }; // Exclude self
    
    if (req.user.role === 'admin') {
      // Admin can message students and teachers
      if (type === 'students') {
        query.role = 'student';
      } else if (type === 'teachers') {
        query.role = 'teacher';
      } else {
        query.role = { $in: ['student', 'teacher'] };
      }
    } else if (req.user.role === 'teacher') {
      // Teacher can message students and admins
      if (type === 'students') {
        query.role = 'student';
      } else if (type === 'admins') {
        query.role = 'admin';
      } else {
        query.role = { $in: ['student', 'admin'] };
      }
    } else if (req.user.role === 'student') {
      // Student can message teachers and admins
      if (type === 'teachers') {
        query.role = 'teacher';
      } else if (type === 'admins') {
        query.role = 'admin';
      } else {
        query.role = { $in: ['teacher', 'admin'] };
      }
    }
    
    const users = await User.find(query).select('name email avatar role department semester').sort('name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
