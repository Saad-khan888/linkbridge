import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = 'mongodb+srv://supersaad888_db_user:h17eYyQBQMyM5hvi@cluster0.fjoow5v.mongodb.net/linkbridge?retryWrites=true&w=majority&appName=Cluster0';

async function fixAllPasswords() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to Atlas\n');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to fix\n`);

    // Fix each user's password
    for (const user of users) {
      const plainPassword = user.role === 'admin' ? 'saad12345' : '1234567890';
      
      // Set plain password - the pre-save hook will hash it
      user.password = plainPassword;
      await user.save();
      
      // Verify
      const verify = await User.findById(user._id);
      const works = await verify.comparePassword(plainPassword);
      
      console.log(`${works ? '✅' : '❌'} ${user.email} (${user.role}) - Password: ${plainPassword}`);
    }

    console.log('\n🎉 All passwords fixed!\n');
    console.log('=== LOGIN CREDENTIALS ===\n');
    console.log('👨‍💼 ADMIN:');
    console.log('   Email: saad@gmail.com');
    console.log('   Password: saad12345\n');
    console.log('👨‍🏫 TEACHERS & 👨‍🎓 STUDENTS (all):');
    console.log('   Password: 1234567890\n');
    
    const teachers = users.filter(u => u.role === 'teacher');
    const students = users.filter(u => u.role === 'student');
    
    console.log('Teachers:');
    teachers.forEach(t => console.log(`   ${t.email}`));
    console.log('\nStudents:');
    students.forEach(s => console.log(`   ${s.email}`));
    console.log('\n===========================\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

fixAllPasswords();
