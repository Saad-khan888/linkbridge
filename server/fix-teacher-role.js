import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function fixTeacherRole() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find the teacher account
    const teacher = await User.findOne({ email: 'teacher@gmail.com' });
    
    if (!teacher) {
      console.log('Teacher account not found!');
      return;
    }

    console.log('Current teacher data:');
    console.log(`Name: ${teacher.name}`);
    console.log(`Email: ${teacher.email}`);
    console.log(`Role: ${teacher.role}`);
    console.log(`Employee ID: ${teacher.employeeId || 'NOT SET'}`);
    console.log(`Enrollment Number: ${teacher.enrollmentNumber || 'NOT SET'}`);
    console.log(`Approved: ${teacher.isApproved}`);
    console.log('\n');

    // Update to teacher role
    teacher.role = 'teacher';
    teacher.employeeId = 'EMP001';
    teacher.isApproved = true; // Approve the teacher
    teacher.enrollmentNumber = undefined; // Remove student field
    teacher.semester = undefined; // Remove student field
    
    await teacher.save();

    console.log('✓ Teacher account updated successfully!\n');
    
    // Verify the update
    const updated = await User.findOne({ email: 'teacher@gmail.com' });
    console.log('Updated teacher data:');
    console.log(`Name: ${updated.name}`);
    console.log(`Email: ${updated.email}`);
    console.log(`Role: ${updated.role}`);
    console.log(`Employee ID: ${updated.employeeId || 'NOT SET'}`);
    console.log(`Enrollment Number: ${updated.enrollmentNumber || 'NOT SET'}`);
    console.log(`Approved: ${updated.isApproved}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

fixTeacherRole();
