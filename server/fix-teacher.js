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

async function fixTeacher() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Update teacher@gmail.com to have teacher role
    const result = await User.findOneAndUpdate(
      { email: 'teacher@gmail.com' },
      { 
        role: 'teacher',
        isApproved: true,
        employeeId: 'EMP001',
        $unset: { enrollmentNumber: '', semester: '' } // Remove student fields
      },
      { new: true }
    );
    
    if (result) {
      console.log('✓ Teacher role updated successfully!');
      console.log('Updated user:');
      console.log('  Name:', result.name);
      console.log('  Email:', result.email);
      console.log('  Role:', result.role);
      console.log('  Employee ID:', result.employeeId);
      console.log('  Approved:', result.isApproved);
      console.log('  Active:', result.isActive);
    } else {
      console.log('❌ No user found with email: teacher@gmail.com');
    }
    
  } catch (error) {
    console.error('Error updating teacher:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

fixTeacher();
