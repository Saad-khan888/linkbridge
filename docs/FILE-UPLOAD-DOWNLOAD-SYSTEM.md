# File Upload & Download System - Linkbridge

## Overview
Linkbridge uses **Cloudinary** for all file storage and delivery. This document explains the standardized approach for handling ALL file types.

---

## Supported File Types

### ✅ ALL File Formats Supported:
- **Documents**: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx)
- **Archives**: ZIP, RAR, 7-Zip
- **Images**: JPG, PNG, GIF, SVG, WebP, BMP
- **Videos**: MP4, WebM, OGG
- **Audio**: MP3, WAV
- **Text**: TXT, CSV
- **Any other file type**: Cloudinary handles them as `raw` resource type

---

## System Architecture

### 1. File Upload Flow (Admin/Teacher → Cloudinary)

```
User selects file → Frontend sends to /api/upload → Backend processes → Cloudinary stores → URL returned → Saved to MongoDB
```

**Backend (`server/routes/upload.js`):**
- Accepts files up to **10MB** (configurable in `server/config/cloudinary.js`)
- Authenticates user with JWT
- Converts file to base64
- Determines resource type:
  - `image` for images
  - `video` for videos
  - `raw` for everything else (PDFs, docs, archives, etc.)
- Uploads to Cloudinary folder: `edu-lms`
- Returns: `{ url, publicId, filename, fileType, size }`

**Key Settings:**
- `use_filename: true` - Preserves original filename
- `unique_filename: true` - Adds unique suffix to avoid conflicts

---

### 2. File Display & Download Flow (Student Views)

```
Fetch data from API → Extract file info → Apply getDownloadUrl() → Display with badge → User clicks → Download/Open
```

**Frontend (`client/src/utils/fileUtils.js`):**

#### Core Functions:

**`getDownloadUrl(url, filename)`**
- Takes Cloudinary URL and filename
- For files that should **download** (Word, Excel, ZIP, etc.): Adds `fl_attachment` flag
- For files that should **open in browser** (Images, PDFs, Videos): Returns URL as-is
- Returns modified URL

**`getFileTypeLabel(filename)`**
- Extracts file extension
- Returns user-friendly label: "PDF", "Word", "Excel", "ZIP", "Image", etc.
- Shows as badge next to filename

**`shouldOpenInBrowser(filename)`**
- Determines if file should open in new tab vs download
- Opens: Images, PDFs, Videos
- Downloads: Everything else

---

## File Behavior by Type

| File Type | Cloudinary Type | User Action | Badge Label |
|-----------|----------------|-------------|-------------|
| PDF | `raw` | Opens in browser | PDF |
| Word (.docx) | `raw` | Downloads | Word |
| Excel (.xlsx) | `raw` | Downloads | Excel |
| PowerPoint | `raw` | Downloads | PowerPoint |
| ZIP | `raw` | Downloads | ZIP |
| Images (JPG, PNG) | `image` | Opens in browser | Image |
| Videos (MP4) | `video` | Opens in browser | Video |
| Text files | `raw` | Downloads | Text |

---

## Implementation Details

### Components Using File System:

1. **StudentDashboard.jsx**
   - Assignments section
   - Announcements section
   - Materials section
   - Notices section

2. **TeacherDashboard.jsx**
   - All sections (view/upload files)

3. **AdminDashboard.jsx**
   - All sections (view/upload files)

### File Display Pattern:
```jsx
import { getDownloadUrl, getFileTypeLabel } from '../utils/fileUtils';

// In render:
{files.map((file, idx) => {
  const fileName = file.filename || `File ${idx + 1}`;
  const downloadUrl = getDownloadUrl(file.url, fileName);
  const fileType = getFileTypeLabel(fileName);
  
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
      <Download size={14} />
      <span>{fileName}</span>
      <span className="file-badge">{fileType}</span>
    </a>
  );
})}
```

---

## Database Schema

Files are stored in MongoDB as part of their parent documents:

```javascript
{
  title: "Assignment 1",
  attachments: [
    {
      url: "https://res.cloudinary.com/.../file.pdf",
      publicId: "edu-lms/xyz123",
      filename: "assignment.pdf",
      fileType: "application/pdf",
      size: 2048576
    }
  ]
}
```

---

## Cloudinary URL Structure

### Standard URL (No modifications needed):
```
https://res.cloudinary.com/[cloud-name]/[resource-type]/upload/v[version]/[folder]/[public-id].[ext]
```

### With Download Flag (for Word, Excel, ZIP, etc.):
```
https://res.cloudinary.com/[cloud-name]/raw/upload/fl_attachment/v[version]/[folder]/[public-id].[ext]
```

The `fl_attachment` flag tells Cloudinary to set the `Content-Disposition: attachment` header, forcing browser to download instead of display.

---

## Configuration

### Environment Variables (.env):
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### File Size Limit:
Current: **10MB** per file
Location: `server/config/cloudinary.js`
```javascript
limits: {
  fileSize: 10 * 1024 * 1024 // 10MB
}
```

---

## How It Works in Practice

### Example 1: Admin Uploads PDF Assignment
1. Admin creates assignment, clicks "Upload Files", selects `assignment.pdf`
2. File sent to `/api/upload`
3. Backend uploads to Cloudinary as `raw` type
4. Cloudinary returns: `https://res.cloudinary.com/.../raw/upload/.../assignment_abc123.pdf`
5. Saved to database in assignment document
6. Students see "assignment.pdf" with "PDF" badge
7. Student clicks → Opens in browser (PDF behavior)

### Example 2: Teacher Uploads Word Document
1. Teacher uploads `syllabus.docx`
2. Same upload process
3. Cloudinary stores as `raw` type
4. Frontend applies `getDownloadUrl()` → adds `/fl_attachment/` flag
5. URL becomes: `https://res.cloudinary.com/.../raw/upload/fl_attachment/.../syllabus_xyz789.docx`
6. Student clicks → **Downloads** to their computer (Word behavior)

### Example 3: Admin Uploads ZIP Archive
1. Admin uploads `resources.zip` (5MB)
2. Uploaded to Cloudinary
3. Students see "resources.zip" with "ZIP" badge
4. Click → Downloads directly

---

## Testing Checklist

- [ ] Upload PDF - should open in browser
- [ ] Upload Word doc - should download
- [ ] Upload Excel file - should download
- [ ] Upload ZIP archive - should download
- [ ] Upload image - should open in browser
- [ ] Upload video - should open in browser
- [ ] File size validation (reject >10MB)
- [ ] Filename preservation (check original name is saved)
- [ ] Multiple file upload
- [ ] File type badge displays correctly

---

## Troubleshooting

### Files download with wrong name:
- Check `filename` is stored in database
- Verify `getFileTypeLabel()` is imported and used

### Files open instead of download:
- Check if `fl_attachment` flag is applied (Word, Excel, ZIP should have it)
- Verify `getDownloadUrl()` function is called before rendering

### Upload fails:
- Check Cloudinary credentials in `.env`
- Verify file size is under 10MB
- Check backend logs for specific error

### Wrong file type badge:
- Verify filename has proper extension
- Check `getFileTypeLabel()` function mapping

---

## Future Enhancements

- [ ] Progress bar for large file uploads
- [ ] File preview modal for images
- [ ] Bulk file download (ZIP multiple files)
- [ ] File search/filter by type
- [ ] Thumbnail generation for videos
- [ ] Drag-and-drop upload interface

---

## Summary

**Standard Cloudinary Approach:**
1. Upload files with proper resource type (`image`, `video`, or `raw`)
2. Store URL, filename, and metadata in MongoDB
3. Use `getDownloadUrl()` to add download flags for non-viewable files
4. Display with appropriate file type badges
5. Let browser handle opening/downloading based on file type and URL flags

This approach is:
- ✅ **Simple** - Clean utility functions, consistent pattern
- ✅ **Reliable** - Uses Cloudinary's built-in features
- ✅ **Standard** - Industry best practice
- ✅ **Scalable** - Handles any file type, any size (within limits)
- ✅ **Professional** - Proper separation of concerns

No complex workarounds needed - just standard Cloudinary + smart URL handling!
