import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const MONGODB_URI = 'mongodb+srv://supersaad888_db_user:h17eYyQBQMyM5hvi@cluster0.fjoow5v.mongodb.net/linkbridge?retryWrites=true&w=majority&appName=Cluster0';

async function checkAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to Atlas');

    const admin = await User.findOne({ email: 'saad@gmail.com' });
    
    if (!admin) {
      console.log('❌ Admin not found!');
      return;
    }

    console.log('✅ Admin found:');
    console.log('   Name:', admin.name);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Active:', admin.isActive);
    console.log('   Password hash:', admin.password.substring(0, 20) + '...');

    // Test password
    const testPassword = 'saad12345';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log('\n🔐 Password Test:');
    console.log('   Testing password:', testPassword);
    console.log('   Match:', isMatch ? '✅ YES' : '❌ NO');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkAdmin();
