import express from 'express';
import Message from '../models/Message.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : {
      $or: [
        { isGeneral: true },
        { department: req.user.department, semester: req.user.semester }
      ]
    };
    const messages = await Message.find(query).populate('sender', 'name avatar role').sort('createdAt').limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
