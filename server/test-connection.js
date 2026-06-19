import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

console.log('=== Testing Database Connection ===\n');

console.log('Environment Variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI || 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('\n');

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected successfully!\n');

    console.log('Testing User model...');
    const userCount = await User.countDocuments();
    console.log(`✓ Found ${userCount} users in database\n`);

    if (userCount > 0) {
      console.log('Sample user:');
      const sampleUser = await User.findOne();
      console.log({
        name: sampleUser.name,
        email: sampleUser.email,
        role: sampleUser.role,
        hasPassword: !!sampleUser.password
      });
      console.log('\n');

      // Test password comparison
      console.log('Testing password comparison...');
      const testPassword = 'saad12345';
      const isMatch = await sampleUser.comparePassword(testPassword);
      console.log(`Password comparison result: ${isMatch ? '✓ Works' : '✗ Failed'}\n`);
    }

    console.log('=== All tests passed! ===');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testConnection();
