import express from 'express';
import Material from '../models/Material.js';
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
    const materials = await Material.find(query).populate('createdBy', 'name').sort('-createdAt');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authenticate, authorizeTeacher, async (req, res) => {
  try {
    const material = new Material({ ...req.body, createdBy: req.user._id });
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, authorizeTeacher, async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
