import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Assignment from './models/Assignment.js';
import Announcement from './models/Announcement.js';
import Material from './models/Material.js';
import Event from './models/Event.js';
import Notice from './models/Notice.js';

dotenv.config();

// Use Atlas connection string
const MONGODB_URI = 'mongodb+srv://supersaad888_db_user:h17eYyQBQMyM5hvi@cluster0.fjoow5v.mongodb.net/linkbridge?retryWrites=true&w=majority&appName=Cluster0';

async function seedProduction() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await User.deleteMany({});
    await Assignment.deleteMany({});
    await Announcement.deleteMany({});
    await Material.deleteMany({});
    await Event.deleteMany({});
    await Notice.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash password (same for all demo users)
    const password = await bcrypt.hash('1234567890', 10);
    const adminPassword = await bcrypt.hash('saad12345', 10);

    // Create Admin
    const admin = await User.create({
      name: 'Saad Admin',
      email: 'saad@gmail.com',
      password: adminPassword,
      role: 'admin',
      isActive: true
    });
    console.log('✅ Admin created:', admin.email);

    // Create Teachers
    const teachers = await User.create([
      {
        name: 'Dr. Ahmed Hassan',
        email: 'ahmed@teacher.com',
        password,
        role: 'teacher',
        department: 'Computer Science',
        isActive: true,
        isApproved: true
      },
      {
        name: 'Prof. Sarah Khan',
        email: 'sarah@teacher.com',
        password,
        role: 'teacher',
        department: 'Political Science',
        isActive: true,
        isApproved: true
      },
      {
        name: 'Dr. Ali Raza',
        email: 'ali@teacher.com',
        password,
        role: 'teacher',
        department: 'BBA',
        isActive: true,
        isApproved: true
      }
    ]);
    console.log(`✅ Created ${teachers.length} teachers`);

    // Create Students
    const students = await User.create([
      {
        name: 'Muhammad Saad',
        email: 'saad@student.com',
        password,
        role: 'student',
        enrollmentNumber: '2022-FP-3290',
        department: 'Computer Science',
        semester: 8,
        isActive: true
      },
      {
        name: 'Fatima Ali',
        email: 'fatima@student.com',
        password,
        role: 'student',
        enrollmentNumber: '2022-FP-1234',
        department: 'Computer Science',
        semester: 6,
        isActive: true
      },
      {
        name: 'Hassan Ahmed',
        email: 'hassan@student.com',
        password,
        role: 'student',
        enrollmentNumber: '2023-FP-5678',
        department: 'Political Science',
        semester: 4,
        isActive: true
      },
      {
        name: 'Ayesha Khan',
        email: 'ayesha@student.com',
        password,
        role: 'student',
        enrollmentNumber: '2023-FP-9101',
        department: 'BBA',
        semester: 4,
        isActive: true
      },
      {
        name: 'Usman Malik',
        email: 'usman@student.com',
        password,
        role: 'student',
        enrollmentNumber: '2022-FP-1122',
        department: 'Computer Science',
        semester: 6,
        isActive: true
      }
    ]);
    console.log(`✅ Created ${students.length} students`);

    // Create Assignments
    const assignments = await Assignment.create([
      {
        title: 'Web Development Project',
        description: 'Build a full-stack web application using MERN stack. Include authentication, CRUD operations, and proper error handling.',
        subject: 'Web Technologies',
        department: 'Computer Science',
        semester: 6,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdBy: teachers[0]._id
      },
      {
        title: 'Database Design Assignment',
        description: 'Design a normalized database schema for an e-commerce application. Include ER diagram and SQL queries.',
        subject: 'Database Management',
        department: 'Computer Science',
        semester: 4,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdBy: teachers[0]._id
      },
      {
        title: 'International Relations Essay',
        description: 'Write a 2000-word essay on the impact of globalization on developing countries.',
        subject: 'Political Theory',
        department: 'Political Science',
        semester: 4,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        createdBy: teachers[1]._id
      },
      {
        title: 'Business Plan Presentation',
        description: 'Prepare a comprehensive business plan for a startup. Include market analysis, financial projections, and SWOT analysis.',
        subject: 'Entrepreneurship',
        department: 'BBA',
        semester: 4,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdBy: teachers[2]._id
      }
    ]);
    console.log(`✅ Created ${assignments.length} assignments`);

    // Create Announcements
    const announcements = await Announcement.create([
      {
        title: 'Welcome to Spring Semester 2024',
        content: 'Welcome back students! The new semester begins next week. Make sure to check your course schedules and complete registration.',
        type: 'general',
        department: '',
        isPinned: true,
        createdBy: admin._id
      },
      {
        title: 'Mid-Term Exams Schedule Released',
        content: 'Mid-term examination schedule has been released. Please check the notice board for detailed timetable. Exams will begin from next month.',
        type: 'urgent',
        department: '',
        isPinned: true,
        createdBy: admin._id
      },
      {
        title: 'CS Department Workshop',
        content: 'A workshop on React.js and Node.js will be conducted this Saturday. All CS students are encouraged to participate.',
        type: 'event',
        department: 'Computer Science',
        isPinned: false,
        createdBy: teachers[0]._id
      },
      {
        title: 'Library Hours Extended',
        content: 'Library will now remain open until 10 PM on weekdays to facilitate students during exam preparation.',
        type: 'notice',
        department: '',
        isPinned: false,
        createdBy: admin._id
      }
    ]);
    console.log(`✅ Created ${announcements.length} announcements`);

    // Create Study Materials
    const materials = await Material.create([
      {
        title: 'React.js Complete Guide',
        description: 'Comprehensive notes on React.js including hooks, context API, and state management.',
        subject: 'Web Technologies',
        department: 'Computer Science',
        semester: 6,
        category: 'notes',
        createdBy: teachers[0]._id
      },
      {
        title: 'Database Normalization Tutorial',
        description: 'Step-by-step guide to database normalization (1NF, 2NF, 3NF, BCNF) with examples.',
        subject: 'Database Management',
        department: 'Computer Science',
        semester: 4,
        category: 'slides',
        createdBy: teachers[0]._id
      },
      {
        title: 'Political Theory Reference Book',
        description: 'Recommended readings and reference materials for Political Theory course.',
        subject: 'Political Theory',
        department: 'Political Science',
        semester: 4,
        category: 'reference',
        createdBy: teachers[1]._id
      },
      {
        title: 'Marketing Management Notes',
        description: 'Complete notes covering marketing strategies, consumer behavior, and market research.',
        subject: 'Marketing',
        department: 'BBA',
        semester: 4,
        category: 'notes',
        createdBy: teachers[2]._id
      }
    ]);
    console.log(`✅ Created ${materials.length} study materials`);

    // Create Events
    const events = await Event.create([
      {
        title: 'Annual Sports Day',
        description: 'Join us for the annual sports day with various competitions including cricket, football, and athletics.',
        eventDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'University Sports Ground',
        department: '',
        createdBy: admin._id
      },
      {
        title: 'Tech Fest 2024',
        description: 'CS Department is organizing a tech fest featuring coding competitions, hackathons, and tech talks.',
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'Main Auditorium',
        department: 'Computer Science',
        createdBy: teachers[0]._id
      },
      {
        title: 'Career Counseling Session',
        description: 'Industry experts will guide students about career opportunities and job market trends.',
        eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'Conference Hall',
        department: '',
        createdBy: admin._id
      }
    ]);
    console.log(`✅ Created ${events.length} events`);

    // Create Notices
    const notices = await Notice.create([
      {
        title: 'Fee Submission Deadline',
        content: 'Last date for semester fee submission is 15th of this month. Late fee will be applicable after the deadline.',
        category: 'academic',
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        createdBy: admin._id
      },
      {
        title: 'Project Submission Guidelines',
        content: 'All final year projects must be submitted in both soft and hard copy. Include complete documentation and source code.',
        category: 'academic',
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        createdBy: admin._id
      },
      {
        title: 'Eid Holidays',
        content: 'University will remain closed for Eid holidays from 20th to 25th. Classes will resume on 26th.',
        category: 'holiday',
        validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        createdBy: admin._id
      }
    ]);
    console.log(`✅ Created ${notices.length} notices`);

    console.log('\n🎉 Production database seeded successfully!\n');
    console.log('=== LOGIN CREDENTIALS ===\n');
    console.log('👨‍💼 ADMIN:');
    console.log('   Email: saad@gmail.com');
    console.log('   Password: saad12345\n');
    console.log('👨‍🏫 TEACHERS (all use password: 1234567890):');
    teachers.forEach(t => console.log(`   ${t.email}`));
    console.log('\n👨‍🎓 STUDENTS (all use password: 1234567890):');
    students.forEach(s => console.log(`   ${s.email}`));
    console.log('\n===========================\n');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedProduction();
