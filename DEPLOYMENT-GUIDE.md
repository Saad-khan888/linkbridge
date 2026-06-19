# 🚀 Linkbridge Deployment Guide

## Repository
**GitHub:** https://github.com/Saad-khan888/linkbridge.git

---

## 📋 Pre-Deployment Checklist

✅ Code pushed to GitHub  
✅ `.env` excluded from repository  
✅ Thesis folders excluded  
✅ MongoDB Atlas credentials ready  
✅ Cloudinary credentials ready  

---

# Part 1: Deploy Backend to Render

## Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your GitHub repositories

## Step 2: Create New Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Search and select: **linkbridge**
5. Click **"Connect"**

## Step 3: Configure Web Service

### Basic Settings:
- **Name:** `linkbridge-api` (or any name you prefer)
- **Region:** Choose closest to your location
- **Branch:** `main`
- **Root Directory:** `server` ⚠️ IMPORTANT
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

### Instance Type:
- Select **"Free"** (for testing)
- Note: Free tier sleeps after 15 min of inactivity

## Step 4: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables ONE BY ONE:

```
MONGODB_URI
mongodb+srv://supersaad888_db_user:h17eYyQBQMyM5hvi@cluster0.fjoow5v.mongodb.net/linkbridge?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET
your_jwt_secret_key_change_this_in_production_render_2024

CLOUDINARY_CLOUD_NAME
dmybaiboy

CLOUDINARY_API_KEY
874796959772737

CLOUDINARY_API_SECRET
wGXChYlkbdk9ktAKlWSeum1TIAY

CLIENT_URL
https://linkbridge.vercel.app

PORT
10000
```

**Note:** Replace `https://linkbridge.vercel.app` with your actual Vercel URL after frontend deployment

## Step 5: Deploy Backend
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for build and deployment
3. Watch the logs for any errors
4. Once deployed, you'll see: ✅ **"Your service is live"**
5. Copy your backend URL: `https://linkbridge-api.onrender.com`

---

# Part 2: Deploy Frontend to Vercel

## Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

## Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Find and select: **linkbridge**
4. Click **"Import"**

## Step 3: Configure Project

### Framework Preset:
- Vercel should auto-detect: **Vite**

### Root Directory:
- Click **"Edit"**
- Set to: `client` ⚠️ IMPORTANT

### Build Settings:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Step 4: Environment Variables

Click **"Environment Variables"**

Add this variable:

```
Name: VITE_API_URL
Value: https://linkbridge-api.onrender.com
```

⚠️ **IMPORTANT:** Replace with YOUR actual Render backend URL

## Step 5: Deploy Frontend
1. Click **"Deploy"**
2. Wait 1-2 minutes for build and deployment
3. Once done, you'll get your live URL
4. Click **"Visit"** to see your app!

Your Vercel URL will be something like:
- `https://linkbridge.vercel.app`
- Or: `https://linkbridge-[random].vercel.app`

---

# Part 3: Update Backend CORS & CLIENT_URL

## After Frontend Deployment:

1. Go back to **Render Dashboard**
2. Select your **linkbridge-api** service
3. Go to **"Environment"** tab
4. Find `CLIENT_URL` variable
5. Click **"Edit"**
6. Update value to your **actual Vercel URL**:
   ```
   https://linkbridge.vercel.app
   ```
7. Click **"Save Changes"**
8. Service will automatically redeploy (wait 1-2 min)

---

# Part 4: Update Frontend API URL

## If you need to update the backend URL:

1. Go to **Vercel Dashboard**
2. Select your **linkbridge** project
3. Go to **"Settings"** → **"Environment Variables"**
4. Find `VITE_API_URL`
5. Click **"Edit"**
6. Update to your Render URL
7. Click **"Save"**
8. Go to **"Deployments"** tab
9. Click **"..."** on latest deployment → **"Redeploy"**

---

# Part 5: Test Your Deployed App

## Frontend Testing:
1. Visit your Vercel URL
2. Try registering a new student account
3. Try logging in
4. Check if pages load correctly

## Backend Testing:
1. Visit: `https://your-render-url.onrender.com`
2. You should see: "Cannot GET /" (this is normal)
3. Try: `https://your-render-url.onrender.com/api/auth` 
4. Should return: 404 or method not allowed (means API is working)

## Full Flow Testing:
1. Register as a student
2. Login
3. Check if dashboard loads
4. Upload a file (test Cloudinary)
5. Download the file
6. Test messaging features

---

# Part 6: Seed Production Database (Optional)

## If you want demo data in production:

### Option 1: Use MongoDB Compass
1. Download MongoDB Compass
2. Connect to Atlas:
   ```
   mongodb+srv://supersaad888_db_user:h17eYyQBQMyM5hvi@cluster0.fjoow5v.mongodb.net/
   ```
3. Select database: `linkbridge`
4. Manually add demo users/data

### Option 2: Modify seed.js temporarily
1. Update `server/seed.js` to use Atlas connection
2. Run locally: `node server/seed.js`
3. Reverts back to local connection after seeding

### Option 3: Create admin through UI
1. Go to: `https://your-vercel-url/admin/login`
2. Register first admin manually
3. Use admin panel to create demo content

---

# 🔧 Troubleshooting

## Backend Issues:

### "Application failed to respond"
- Check Render logs for errors
- Verify MongoDB Atlas connection string
- Check if Atlas IP whitelist includes `0.0.0.0/0`

### "Cannot connect to database"
- Go to MongoDB Atlas
- Click "Network Access"
- Add IP: `0.0.0.0/0` (allow from anywhere)

### CORS errors in browser
- Check `CLIENT_URL` env var matches Vercel URL exactly
- Include https:// in the URL
- Redeploy backend after changing

## Frontend Issues:

### "Network Error" or "Failed to fetch"
- Check `VITE_API_URL` points to correct Render URL
- Include https:// in the URL
- Verify backend is running (visit Render URL)

### Blank page after deployment
- Check Vercel build logs for errors
- Verify Root Directory is set to `client`
- Check browser console for errors

### Files not downloading properly
- Verify Cloudinary credentials are correct
- Check if `/api/download` route is accessible
- Test direct Cloudinary URLs

---

# 📊 MongoDB Atlas Configuration

## Allow Access from Anywhere:
1. Go to MongoDB Atlas Dashboard
2. Click **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"**
5. Enter: `0.0.0.0/0`
6. Click **"Confirm"**

This allows Render servers to connect to your database.

---

# 🎯 Important URLs to Save

```
GitHub Repository:
https://github.com/Saad-khan888/linkbridge.git

Render Backend:
https://linkbridge-api.onrender.com (replace with your actual URL)

Vercel Frontend:
https://linkbridge.vercel.app (replace with your actual URL)

MongoDB Atlas:
https://cloud.mongodb.com/

Cloudinary Dashboard:
https://cloudinary.com/console
```

---

# 🔐 Security Best Practices

## For Production (After Testing):

1. **Change JWT Secret:**
   - Use a strong random string
   - Update on Render

2. **Restrict MongoDB Access:**
   - Instead of `0.0.0.0/0`, add specific Render IPs
   - Available in Render dashboard

3. **Enable HTTPS Only:**
   - Both Vercel and Render provide free SSL
   - Already enabled by default

4. **Rotate Cloudinary Keys (optional):**
   - Create production-specific keys
   - Separate from development

5. **Set up Custom Domain (optional):**
   - Both Vercel and Render support custom domains
   - Follow their respective guides

---

# 📈 Monitoring & Logs

## Render Logs:
- Go to your service
- Click "Logs" tab
- See real-time server logs

## Vercel Logs:
- Go to your project
- Click "Deployments"
- Click on a deployment
- View build and runtime logs

## MongoDB Atlas Monitoring:
- Dashboard shows database metrics
- Monitor connections, operations, storage

---

# 🎉 Success Checklist

After deployment, verify:

- ✅ Backend is live on Render
- ✅ Frontend is live on Vercel
- ✅ Can register new user
- ✅ Can login successfully
- ✅ Dashboard loads properly
- ✅ Can upload files
- ✅ Can download files with correct names
- ✅ Real-time chat works
- ✅ All three roles work (Student, Teacher, Admin)

---

# 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render/Vercel logs
3. Check browser console for frontend errors
4. Verify all environment variables are correct
5. Test each component individually

---

# 🚀 You're Ready to Deploy!

Follow the steps in order:
1. Deploy Backend (Render)
2. Deploy Frontend (Vercel)
3. Update CORS settings
4. Test everything
5. Share your live app!

Good luck! 🎓
