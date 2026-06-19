import express from 'express';
import Notice from '../models/Notice.js';
import { authenticate, authorizeTeacher } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : {
      isActive: true,
      $or: [
        { department: req.user.department },
        { department: null }
      ]
    };
    const notices = await Notice.find(query).populate('createdBy', 'name').sort('-createdAt');
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authenticate, authorizeTeacher, async (req, res) => {
  try {
    const notice = new Notice({ ...req.body, createdBy: req.user._id });
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, authorizeTeacher, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
