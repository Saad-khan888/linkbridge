import express from 'express';
import cloudinary from '../config/cloudinary.js';
import { upload } from '../config/cloudinary.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request received');
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', req.file.originalname, req.file.size, 'bytes');

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ 
        message: 'Cloudinary not configured. Please add credentials to .env file',
        hint: 'Check CLOUDINARY_SETUP.md for instructions'
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log('Uploading to Cloudinary...');
    
    // Determine resource type
    const isImage = req.file.mimetype.startsWith('image/');
    const isVideo = req.file.mimetype.startsWith('video/');
    
    let resourceType = 'raw'; // Default for documents, PDFs, archives, etc.
    if (isImage) resourceType = 'image';
    if (isVideo) resourceType = 'video';
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'edu-lms',
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true
    });

    console.log('Upload successful:', result.secure_url);

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Upload failed', 
      error: error.message,
      hint: error.message.includes('credentials') ? 'Check your Cloudinary credentials in .env file' : undefined
    });
  }
});

export default router;
