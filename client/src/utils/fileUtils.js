/**
 * Generates a download URL through backend proxy to preserve filename
 * @param {string} cloudinaryUrl - The original Cloudinary URL
 * @param {string} filename - The original filename to preserve
 * @returns {string} - Proxied download URL
 */
export const getDownloadUrl = (cloudinaryUrl, filename) => {
  if (!cloudinaryUrl) return '';
  
  // Check if file should open in browser (only images and videos)
  const openInBrowser = shouldOpenInBrowser(filename);
  
  // Only images and videos open directly from Cloudinary
  // PDFs and all documents use backend proxy to preserve filename
  if (openInBrowser) {
    return cloudinaryUrl;
  }
  
  // For all other files (PDFs, Word, Excel, ZIP, etc.), use backend proxy
  // This ensures proper filename on download
  const backendUrl = 'http://localhost:5000';
  return `${backendUrl}/api/download?url=${encodeURIComponent(cloudinaryUrl)}&filename=${encodeURIComponent(filename)}`;
};

/**
 * Helper function to determine if file should open in browser or download
 * @param {string} filename - The filename with extension
 * @returns {boolean} - True if file should open in browser (only images and videos)
 */
export const shouldOpenInBrowser = (filename) => {
  if (!filename) return false;
  // Only images and videos open in browser
  // PDFs now download with proper filename through proxy
  return filename.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|mp4|webm|ogg)$/i);
};

/**
 * Gets file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - File extension in uppercase
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const match = filename.match(/\.([^.]+)$/);
  return match ? match[1].toUpperCase() : '';
};

/**
 * Gets a user-friendly file type label
 * @param {string} filename - The filename
 * @returns {string} - File type label (PDF, Word, Excel, etc.)
 */
export const getFileTypeLabel = (filename) => {
  if (!filename) return 'File';
  
  const ext = filename.match(/\.([^.]+)$/);
  if (!ext) return 'File';
  
  const extension = ext[1].toLowerCase();
  
  const typeMap = {
    pdf: 'PDF',
    doc: 'Word',
    docx: 'Word',
    xls: 'Excel',
    xlsx: 'Excel',
    ppt: 'PowerPoint',
    pptx: 'PowerPoint',
    zip: 'ZIP',
    rar: 'RAR',
    '7z': '7-Zip',
    txt: 'Text',
    csv: 'CSV',
    jpg: 'Image',
    jpeg: 'Image',
    png: 'Image',
    gif: 'Image',
    svg: 'Image',
    webp: 'Image',
    mp4: 'Video',
    webm: 'Video',
    mp3: 'Audio',
    wav: 'Audio'
  };
  
  return typeMap[extension] || extension.toUpperCase();
};
