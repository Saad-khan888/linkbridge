import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.put('/', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'email', 'enrollmentNumber', 'department', 'semester', 'avatar'];
    const actualUpdates = Object.keys(updates).filter(key => allowedUpdates.includes(key));
    
    actualUpdates.forEach(key => {
      req.user[key] = updates[key];
    });
    
    await req.user.save();
    
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        semester: req.user.semester,
        enrollmentNumber: req.user.enrollmentNumber,
        avatar: req.user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});

router.delete('/', authenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

export default router;
