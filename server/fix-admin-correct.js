import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = 'mongodb+srv://supersaad888_db_user:h17eYyQBQMyM5hvi@cluster0.fjoow5v.mongodb.net/linkbridge?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdminCorrectly() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to Atlas');

    // Find or create admin
    let admin = await User.findOne({ email: 'saad@gmail.com' });
    
    if (!admin) {
      console.log('Creating new admin...');
      admin = new User({
        name: 'Saad Admin',
        email: 'saad@gmail.com',
        password: 'saad12345', // Plain text - the pre-save hook will hash it
        role: 'admin',
        isActive: true
      });
    } else {
      console.log('Updating existing admin password...');
      admin.password = 'saad12345'; // Plain text - the pre-save hook will hash it
    }
    
    await admin.save();
    console.log('✅ Admin saved');

    // Verify it works
    const verifyAdmin = await User.findOne({ email: 'saad@gmail.com' });
    const testMatch = await verifyAdmin.comparePassword('saad12345');
    
    console.log('\n🔐 Verification Test:');
    console.log('   Email: saad@gmail.com');
    console.log('   Password: saad12345');
    console.log('   Login Works:', testMatch ? '✅ YES' : '❌ NO');
    
    if (testMatch) {
      console.log('\n✨ Admin login is ready!');
      console.log('   Go to: https://linkbridge-blue.vercel.app/admin/login');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

fixAdminCorrectly();
