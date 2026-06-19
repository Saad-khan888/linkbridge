import express from 'express';
import User from '../models/User.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all pending teacher requests (admin only)
router.get('/pending', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const pendingTeachers = await User.find({ 
      role: 'teacher', 
      isApproved: false 
    }).select('-password').sort({ createdAt: -1 });
    
    res.json(pendingTeachers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending teachers', error: error.message });
  }
});

// Get all approved teachers (admin only)
router.get('/approved', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const approvedTeachers = await User.find({ 
      role: 'teacher', 
      isApproved: true 
    }).select('-password').sort({ createdAt: -1 });
    
    res.json(approvedTeachers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approved teachers', error: error.message });
  }
});

// Approve teacher (admin only)
router.put('/:id/approve', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    if (teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'User is not a teacher' });
    }
    
    teacher.isApproved = true;
    teacher.approvedBy = req.user._id;
    teacher.approvedAt = new Date();
    await teacher.save();
    
    res.json({ 
      message: 'Teacher approved successfully', 
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        employeeId: teacher.employeeId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve teacher', error: error.message });
  }
});

// Reject/Delete teacher request (admin only)
router.delete('/:id/reject', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    if (teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'User is not a teacher' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Teacher request rejected and deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject teacher', error: error.message });
  }
});

// Deactivate teacher (admin only)
router.put('/:id/deactivate', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    if (teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'User is not a teacher' });
    }
    
    teacher.isActive = false;
    await teacher.save();
    
    res.json({ message: 'Teacher deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to deactivate teacher', error: error.message });
  }
});

// Activate teacher (admin only)
router.put('/:id/activate', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    if (teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'User is not a teacher' });
    }
    
    teacher.isActive = true;
    await teacher.save();
    
    res.json({ message: 'Teacher activated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to activate teacher', error: error.message });
  }
});

export default router;
