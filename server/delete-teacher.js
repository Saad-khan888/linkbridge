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

async function deleteTeacher() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find and delete the teacher
    const result = await User.findOneAndDelete({ email: 'teacher@gmail.com' });
    
    if (result) {
      console.log('✓ Teacher account deleted successfully!');
      console.log('Deleted user:', {
        name: result.name,
        email: result.email,
        role: result.role
      });
    } else {
      console.log('❌ No user found with email: teacher@gmail.com');
    }
    
  } catch (error) {
    console.error('Error deleting teacher:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

deleteTeacher();
