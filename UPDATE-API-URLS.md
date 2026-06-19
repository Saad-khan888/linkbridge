# ⚠️ CRITICAL: Update All API URLs

## Problem
Your frontend has hardcoded `localhost:5000` URLs which don't work in production.

## Solution Already Applied
✅ Created `client/src/config/api.js` - centralizes API URL configuration  
✅ Updated `client/src/context/AuthContext.jsx` - now uses API_URL  
✅ Updated `client/src/utils/fileUtils.js` - now uses API_URL  
✅ Updated `client/src/context/SocketContext.jsx` - now uses API_URL  

## Still Need to Update

Replace ALL instances of `'http://localhost:5000'` with `API_URL` in these files:

### Import Statement to Add:
```javascript
import API_URL from '../config/api';
```

### Files to Update:

1. **client/src/pages/StudentDashboard.jsx**
   - Line 32: `io('http://localhost:5000'` → `io(API_URL`
   - Line 51-68: All `axios.get('http://localhost:5000/api/...` → `axios.get(\`${API_URL}/api/...`

2. **client/src/pages/TeacherDashboard.jsx**
   - Line 53: `io('http://localhost:5000'` → `io(API_URL`
   - Lines 72-157: All axios calls

3. **client/src/pages/AdminDashboard.jsx**
   - Line 48: `io('http://localhost:5000'` → `io(API_URL`
   - Lines 67-161: All axios calls

4. **client/src/pages/Profile.jsx**
   - Lines 28, 39: axios calls

5. **client/src/pages/TeacherProfile.jsx**
   - Lines 27, 38: axios calls

6. **client/src/pages/AdminProfile.jsx**
   - Lines 25, 36: axios calls

7. **client/src/components/TeacherApproval.jsx**
   - Lines 21, 22, 35, 49, 63, 73: All axios calls

8. **client/src/components/DirectMessaging.jsx**
   - Lines 77, 86, 95: All axios calls

9. **client/src/components/DeactivatedNotice.jsx**
   - Line 37: axios call

## Quick Fix Script

Run this in your `client/src` directory:

```bash
# Find all files with localhost:5000
grep -r "localhost:5000" . --include="*.jsx"
```

Then manually replace each with `${API_URL}` and add the import.

## Push Updated Code

After making changes:
```bash
git add .
git commit -m "Fix: Replace hardcoded localhost URLs with environment variable"
git push
```

Then redeploy on Vercel (it will auto-deploy from GitHub).
