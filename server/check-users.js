import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  enrollmentNumber: { type: String, sparse: true },
  employeeId: { type: String, sparse: true },
  department: String,
  semester: Number,
  avatar: String,
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const users = await User.find({}).select('-password');
    
    console.log('=== ALL USERS ===\n');
    users.forEach(user => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Active: ${user.isActive}`);
      console.log(`Approved: ${user.isApproved}`);
      if (user.employeeId) console.log(`Employee ID: ${user.employeeId}`);
      if (user.enrollmentNumber) console.log(`Enrollment: ${user.enrollmentNumber}`);
      console.log('---\n');
    });

    console.log(`Total users: ${users.length}`);
    console.log(`Students: ${users.filter(u => u.role === 'student').length}`);
    console.log(`Teachers: ${users.filter(u => u.role === 'teacher').length}`);
    console.log(`Admins: ${users.filter(u => u.role === 'admin').length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkUsers();
