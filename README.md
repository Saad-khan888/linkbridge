# Linkbridge - Educational Communication Platform

A professional MERN stack Learning Management System for seamless educational communication.

## 🚀 Quick Start

### Easiest Way - Control Panel
Double-click **`LINKBRIDGE.bat`** and choose:
- Press `1` to START
- Press `2` to STOP  
- Press `3` for FIRST TIME SETUP
- Press `4` to CHECK STATUS

### Manual Way
**First Time Only:**
```
FIRST-TIME-SETUP.bat
```

**Every Other Time:**
```
START-LINKBRIDGE.bat
```

**To Stop:**
```
STOP-LINKBRIDGE.bat
```

📖 **For detailed instructions, see:** `HOW-TO-START.txt`

---

## 🔑 Login Credentials

### Admin Login
- URL: http://localhost:5173/admin/login
- Email: `saad@gmail.com`
- Password: `saad12345`

### Student Login
- URL: http://localhost:5173/login
- Register a new student account first

---

## ✨ Features

- 📝 **Assignment Management** - Create, submit, and grade assignments
- 📢 **Announcements** - Broadcast important updates
- 📚 **Study Materials** - Upload and share learning resources
- 💬 **Real-time Chat** - General chat room with Socket.IO
- 💌 **Direct Messaging** - Private conversations between users
- 📅 **Events Calendar** - Schedule and manage events
- 📋 **Notices** - Post important notices
- 🔒 **JWT Authentication** - Secure user authentication
- ☁️ **Cloudinary Integration** - File upload and storage
- 👥 **Role-based Access** - Admin and Student roles

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite, Vanilla CSS (Material Design 3)
- **Backend**: Node.js, Express
- **Database**: MongoDB 6.0 (Local)
- **Real-time**: Socket.IO
- **Storage**: Cloudinary
- **Authentication**: JWT

---

## 📁 Project Structure

```
linkbridge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth & Socket context
│   │   ├── pages/         # Page components
│   │   └── App.jsx
│   └── package.json
│
├── server/                # Express backend
│   ├── config/           # Cloudinary config
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── server.js         # Entry point
│   └── seed.js           # Admin user seeding
│
├── mongodb-data/         # MongoDB database files
├── docs/                 # Comprehensive documentation
│
├── LINKBRIDGE.bat        # Control Panel (RECOMMENDED)
├── START-LINKBRIDGE.bat  # Start all services
├── STOP-LINKBRIDGE.bat   # Stop all services
├── FIRST-TIME-SETUP.bat  # Initial setup with admin creation
│
└── HOW-TO-START.txt      # Detailed startup guide
```

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Overview](docs/01-OVERVIEW.md)** - Project introduction and goals
- **[Architecture](docs/02-ARCHITECTURE.md)** - System design and structure
- **[Features](docs/03-FEATURES.md)** - Detailed feature descriptions
- **[Installation](docs/04-INSTALLATION.md)** - Setup instructions
- **[API Documentation](docs/05-API-DOCUMENTATION.md)** - Complete API reference
- **[Database Schema](docs/06-DATABASE-SCHEMA.md)** - MongoDB collections
- **[Frontend Structure](docs/07-FRONTEND-STRUCTURE.md)** - React components
- **[Project Summary](docs/PROJECT-SUMMARY.md)** - Quick reference

---

## 🔧 Manual Setup (Advanced)

### Prerequisites
- Node.js (v14 or higher)
- MongoDB 6.0
- MongoDB Compass (optional)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/linkbridge
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start MongoDB:
```bash
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath mongodb-data
```

5. Seed admin user:
```bash
node seed.js
```

6. Start server:
```bash
npm start
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

---

## 🐛 Troubleshooting

### Port Already in Use
Run `STOP-LINKBRIDGE.bat` first, then start again.

### MongoDB Won't Stop
Right-click `STOP-LINKBRIDGE.bat` → Run as Administrator

### Services Won't Start
1. Run `STOP-LINKBRIDGE.bat`
2. Wait 10 seconds
3. Run `START-LINKBRIDGE.bat`

### Check Service Status
Run `LINKBRIDGE.bat` and press `4`

---

## 📝 Important Notes

- ✅ MongoDB 6.0 is used (stable version)
- ✅ Data is stored in `mongodb-data` folder
- ✅ Keep the 3 terminal windows open while using the app
- ✅ Don't close terminal windows until you're done
- ✅ Admin user is created automatically with FIRST-TIME-SETUP.bat

---

## 🎓 For Examiners

1. Double-click `LINKBRIDGE.bat`
2. Press `1` to start all services
3. Wait 10 seconds
4. Open browser: http://localhost:5173
5. Login with admin credentials (see above)
6. Explore all features

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Developer

Developed as a Final Year Project (FYP)

**Admin Contact:** saad@gmail.com
