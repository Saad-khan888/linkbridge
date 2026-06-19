import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * Proxy route to download files from Cloudinary with proper filename
 * This solves the cross-origin download filename issue
 * Note: Removed authentication for now since users are already authenticated to view files
 */
router.get('/', async (req, res) => {
  try {
    const { url, filename } = req.query;

    if (!url || !filename) {
      return res.status(400).json({ message: 'Missing url or filename parameter' });
    }

    console.log('Download request:', { url, filename });

    // Fetch file from Cloudinary
    const response = await axios.get(url, {
      responseType: 'stream'
    });

    // Set proper headers for download with correct filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    
    console.log('Serving file:', sanitizedFilename);
    
    // Pipe the file stream to response
    response.data.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Failed to download file', error: error.message });
  }
});

export default router;
