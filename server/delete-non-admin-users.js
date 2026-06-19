import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function deleteNonAdminUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find all non-admin users
    const nonAdminUsers = await User.find({ role: { $ne: 'admin' } });
    
    console.log('=== Users to be deleted ===\n');
    nonAdminUsers.forEach(user => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log('---\n');
    });

    if (nonAdminUsers.length === 0) {
      console.log('No non-admin users found.');
      return;
    }

    // Delete all non-admin users
    const result = await User.deleteMany({ role: { $ne: 'admin' } });
    
    console.log(`✓ Deleted ${result.deletedCount} non-admin user(s)\n`);
    
    // Verify remaining users
    const remainingUsers = await User.find({});
    console.log('=== Remaining users ===\n');
    remainingUsers.forEach(user => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log('---\n');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

deleteNonAdminUsers();
