import express from 'express';
import Announcement from '../models/Announcement.js';
import { authenticate, authorizeTeacher } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : {
      $or: [
        { department: req.user.department }, 
        { department: null },
        { department: '' }
      ]
    };
    const announcements = await Announcement.find(query).populate('createdBy', 'name').sort('-isPinned -createdAt');
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authenticate, authorizeTeacher, async (req, res) => {
  try {
    const announcement = new Announcement({ ...req.body, createdBy: req.user._id });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, authorizeTeacher, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
