# ⚡ Linkbridge - Quick Deployment Guide

## 🎯 Step-by-Step (5 Minutes Setup)

---

## 1️⃣ RENDER (Backend) - 3 minutes

### Go to: https://render.com

1. **New Web Service** → Connect GitHub → Select `linkbridge`
2. **Settings:**
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `node server.js`
3. **Environment Variables:**
   ```
   MONGODB_URI = mongodb+srv://supersaad888_db_user:h17eYyQBQMyM5hvi@cluster0.fjoow5v.mongodb.net/linkbridge?retryWrites=true&w=majority&appName=Cluster0
   
   JWT_SECRET = your_jwt_secret_key_change_this_in_production_render_2024
   
   CLOUDINARY_CLOUD_NAME = dmybaiboy
   CLOUDINARY_API_KEY = 874796959772737
   CLOUDINARY_API_SECRET = wGXChYlkbdk9ktAKlWSeum1TIAY
   
   CLIENT_URL = https://linkbridge.vercel.app
   PORT = 10000
   ```
4. **Deploy** → Copy your URL: `https://YOUR-APP.onrender.com`

---

## 2️⃣ VERCEL (Frontend) - 2 minutes

### Go to: https://vercel.com

1. **Import Project** → Select `linkbridge`
2. **Settings:**
   - Root Directory: `client`
   - Framework: Vite (auto-detected)
3. **Environment Variables:**
   ```
   VITE_API_URL = https://YOUR-RENDER-URL.onrender.com
   ```
4. **Deploy** → Copy your URL: `https://YOUR-APP.vercel.app`

---

## 3️⃣ UPDATE BACKEND CORS

1. Go back to **Render** dashboard
2. Edit `CLIENT_URL` → Use your **Vercel URL**
3. Save → Wait for redeploy

---

## 4️⃣ MONGODB ATLAS (Allow Connections)

### Go to: https://cloud.mongodb.com

1. **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere** → `0.0.0.0/0`
3. **Confirm**

---

## ✅ TEST YOUR APP

1. Visit your Vercel URL
2. Register a new account
3. Login and test features
4. Upload/download a file

---

## 🆘 Quick Fixes

**CORS Error?**
- Update `CLIENT_URL` on Render to match Vercel URL exactly

**Can't connect to DB?**
- Add `0.0.0.0/0` to MongoDB Atlas Network Access

**Files not uploading?**
- Check Cloudinary credentials in Render environment variables

**Frontend not loading?**
- Verify `VITE_API_URL` points to your Render URL
- Check Root Directory is set to `client`

---

## 📋 Important URLs

**Your GitHub:** https://github.com/Saad-khan888/linkbridge.git  
**Render Dashboard:** https://dashboard.render.com  
**Vercel Dashboard:** https://vercel.com/dashboard  
**MongoDB Atlas:** https://cloud.mongodb.com  

---

## 🎉 That's It!

Your app is now live on the internet! 🌐
