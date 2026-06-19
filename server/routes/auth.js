import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { name, email, password, role, enrollmentNumber, employeeId, department, semester } = req.body;
    
    console.log('Extracted role:', role);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Validate role-specific fields
    if (role === 'student' && !enrollmentNumber) {
      return res.status(400).json({ message: 'Enrollment number is required for students' });
    }
    
    if (role === 'teacher' && !employeeId) {
      return res.status(400).json({ message: 'Employee ID is required for teachers' });
    }

    const userData = { 
      name, 
      email, 
      password, 
      role: role || 'student',
      department
    };

    console.log('User data before role-specific fields:', userData);

    // Add role-specific fields
    if (role === 'student') {
      userData.enrollmentNumber = enrollmentNumber;
      userData.semester = semester;
      userData.isApproved = true; // Students are auto-approved
    } else if (role === 'teacher') {
      userData.employeeId = employeeId;
      userData.isApproved = false; // Teachers need admin approval
    }

    console.log('Final user data:', userData);

    const user = new User(userData);
    await user.save();

    console.log('User saved:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved
    });

    // For teachers, don't send token until approved
    if (role === 'teacher' && !user.isApproved) {
      console.log('Teacher needs approval, returning requiresApproval response');
      return res.status(201).json({
        message: 'Registration successful! Your account is pending admin approval.',
        requiresApproval: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    console.log('Registration successful, sending token');
    res.status(201).json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        department: user.department,
        semester: user.semester,
        enrollmentNumber: user.enrollmentNumber,
        employeeId: user.employeeId,
        isActive: user.isActive,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { email, password, isAdmin } = req.body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User details:', {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isApproved: user.isApproved,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });
    
    if (!user.isActive) {
      console.log('User is not active');
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check if teacher account is approved
    if (user.role === 'teacher' && !user.isApproved) {
      console.log('Teacher account not approved yet');
      return res.status(403).json({ message: 'Your account is pending admin approval' });
    }

    if (isAdmin && user.role !== 'admin') {
      console.log('User is not admin but tried admin login');
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('Checking if comparePassword method exists:', typeof user.comparePassword);
    
    if (typeof user.comparePassword !== 'function') {
      console.error('comparePassword method not found on user model!');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    console.log('Comparing password...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Generating JWT token...');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Token generated successfully');
    
    const responseData = {
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        department: user.department, 
        semester: user.semester,
        employeeId: user.employeeId,
        enrollmentNumber: user.enrollmentNumber,
        isActive: user.isActive,
        isApproved: user.isApproved
      }
    };
    
    console.log('Login successful! Sending response');
    res.json(responseData);
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  console.log('=== /me endpoint called ===');
  console.log('User ID:', req.user._id);
  console.log('User isActive:', req.user.isActive);
  console.log('User isApproved:', req.user.isApproved);
  
  res.json({ 
    user: { 
      id: req.user._id, 
      _id: req.user._id,
      name: req.user.name, 
      email: req.user.email, 
      role: req.user.role, 
      department: req.user.department, 
      semester: req.user.semester,
      avatar: req.user.avatar,
      enrollmentNumber: req.user.enrollmentNumber,
      employeeId: req.user.employeeId,
      isActive: req.user.isActive,
      isApproved: req.user.isApproved
    } 
  });
});

export default router;
