import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const MONGODB_URI = 'mongodb+srv://supersaad888_db_user:h17eYyQBQMyM5hvi@cluster0.fjoow5v.mongodb.net/linkbridge?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to Atlas');

    // Find admin
    const admin = await User.findOne({ email: 'saad@gmail.com' });
    
    if (!admin) {
      console.log('❌ Admin not found, creating new one...');
      
      const hashedPassword = await bcrypt.hash('saad12345', 10);
      const newAdmin = await User.create({
        name: 'Saad Admin',
        email: 'saad@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      
      console.log('✅ Admin created:', newAdmin.email);
    } else {
      console.log('✅ Admin found, updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash('saad12345', 10);
      admin.password = hashedPassword;
      await admin.save();
      
      console.log('✅ Password updated');
    }

    // Verify it works
    const verifyAdmin = await User.findOne({ email: 'saad@gmail.com' });
    const testMatch = await bcrypt.compare('saad12345', verifyAdmin.password);
    
    console.log('\n🔐 Verification:');
    console.log('   Email: saad@gmail.com');
    console.log('   Password: saad12345');
    console.log('   Works:', testMatch ? '✅ YES' : '❌ NO');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

fixAdmin();
