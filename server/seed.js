import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  enrollmentNumber: { type: String, sparse: true },
  department: String,
  semester: Number,
  avatar: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'saad@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      // Update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user to admin role');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('saad12345', 10);
      
      const admin = new User({
        name: 'Saad Admin',
        email: 'saad@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });

      await admin.save();
      console.log('✓ Admin user created successfully!');
      console.log('Email: saad@gmail.com');
      console.log('Password: saad12345');
      console.log('Role: admin');
    }

    console.log('\nYou can now login at: http://localhost:5173/admin/login');
    
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

seedAdmin();
