# Installation & Setup Guide

## Prerequisites

Before installing Linkbridge, ensure you have the following installed:

### Required Software
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **MongoDB**: Version 6.x or higher
- **Git**: For cloning the repository

### Optional Tools
- **MongoDB Compass**: GUI for MongoDB (recommended)
- **Postman**: For API testing
- **VS Code**: Recommended code editor

## System Requirements

### Minimum Requirements
- **OS**: Windows 10, macOS 10.15+, or Linux
- **RAM**: 4GB
- **Storage**: 2GB free space
- **Internet**: Stable connection for dependencies

### Recommended Requirements
- **OS**: Windows 11, macOS 12+, or Ubuntu 20.04+
- **RAM**: 8GB or more
- **Storage**: 5GB free space
- **Internet**: High-speed connection

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd linkbridge
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Set Up MongoDB

#### Option A: Local MongoDB Installation

**Windows:**
1. Download MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Server
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Whitelist your IP address

### 5. Set Up Cloudinary

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 6. Configure Environment Variables

#### Backend (.env file)

Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/linkbridge
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/linkbridge

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Important**: Replace placeholder values with your actual credentials.

#### Frontend (Optional)

Create `client/.env` file if needed:

```env
VITE_API_URL=http://localhost:5000
```

### 7. Seed Admin User (Optional)

Create an admin user by running the seed script:

```bash
cd server
node seed.js
```

Default admin credentials:
- **Email**: saad@gmail.com
- **Password**: saad12345

**Important**: Change these credentials after first login!

### 8. Start the Application

#### Start Backend Server

```bash
cd server
npm start
```

The server will start on `http://localhost:5000`

#### Start Frontend Development Server

Open a new terminal:

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

### 9. Verify Installation

1. Open browser and navigate to `http://localhost:5173`
2. You should see the Linkbridge landing page
3. Try logging in with admin credentials
4. Check browser console for any errors

## MongoDB Setup Options

### Option 1: Local MongoDB with Compass

1. Install MongoDB Compass
2. Connect to `mongodb://127.0.0.1:27017`
3. Create database named `linkbridge`
4. Collections will be created automatically

### Option 2: MongoDB Atlas

1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (for development)
4. Get connection string
5. Update `MONGODB_URI` in `.env`

### Option 3: Docker MongoDB

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl status mongodb
```

#### 2. Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
- Change port in `server/.env`
- Or kill process using the port:

```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

#### 3. Cloudinary Upload Fails

**Error**: `Cloudinary configuration not found`

**Solution**:
- Verify Cloudinary credentials in `.env`
- Ensure no extra spaces in credentials
- Check if `.env` file is in `server/` directory

#### 4. CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
- Verify `CLIENT_URL` in `server/.env`
- Ensure frontend is running on correct port
- Check CORS configuration in `server/server.js`

#### 5. JWT Token Invalid

**Error**: `JsonWebTokenError: invalid token`

**Solution**:
- Clear browser localStorage
- Log out and log in again
- Verify `JWT_SECRET` is set in `.env`

#### 6. Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Running in Development Mode

1. **Backend with auto-reload**:
   ```bash
   cd server
   npm install -g nodemon
   nodemon server.js
   ```

2. **Frontend with HMR**:
   ```bash
   cd client
   npm run dev
   ```

### Building for Production

#### Build Frontend

```bash
cd client
npm run build
```

This creates optimized files in `client/dist/`

#### Serve Production Build

```bash
cd client
npm run preview
```

## Environment-Specific Configuration

### Development Environment

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/linkbridge-dev
CLIENT_URL=http://localhost:5173
```

### Production Environment

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/linkbridge
CLIENT_URL=https://yourdomain.com
```

## Database Initialization

### Create Initial Admin User

```javascript
// server/seed.js
const User = require('./models/User');

const createAdmin = async () => {
  const admin = new User({
    name: 'Admin User',
    email: 'admin@linkbridge.com',
    password: 'securepassword',
    role: 'admin',
    isActive: true
  });
  await admin.save();
  console.log('Admin created');
};

createAdmin();
```

Run: `node server/seed.js`

## Next Steps

After successful installation:

1. **Change Default Credentials**: Update admin password
2. **Configure Settings**: Adjust application settings
3. **Create Test Data**: Add sample assignments, announcements
4. **Test Features**: Verify all functionality works
5. **Read Documentation**: Explore other documentation files

## Additional Resources

- [Architecture Documentation](./02-ARCHITECTURE.md)
- [API Documentation](./05-API-DOCUMENTATION.md)
- [Deployment Guide](./11-DEPLOYMENT.md)
- [Contributing Guidelines](./12-CONTRIBUTING.md)

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review error messages carefully
3. Check browser console for frontend errors
4. Check server logs for backend errors
5. Search existing issues on GitHub
6. Create a new issue with detailed information
