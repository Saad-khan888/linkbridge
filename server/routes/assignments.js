import express from 'express';
import Assignment from '../models/Assignment.js';
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
    const assignments = await Assignment.find(query).populate('createdBy', 'name').sort('-createdAt');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authenticate, authorizeTeacher, async (req, res) => {
  try {
    const assignment = new Assignment({ ...req.body, createdBy: req.user._id });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/submit', authenticate, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    assignment.submissions.push({
      student: req.user._id,
      files: req.body.files,
      submittedAt: new Date()
    });
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, authorizeTeacher, async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
