const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { authenticate, isAdmin, optionalAuth } = require('../middleware/auth.middleware');
const { downloadLimiter } = require('../middleware/rateLimiter.middleware');
const itemController = require('../controllers/item.controller');

// Upload files (admin only)
router.post('/upload', authenticate, isAdmin, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 },
  { name: 'files', maxCount: 5 }
]), (req, res) => {
  try {
    // Convert Windows backslashes to forward slashes for URLs
    const normalizePath = (filePath) => filePath ? filePath.replace(/\\/g, '/') : null;
    
    const response = {
      thumbnail: req.files.thumbnail ? normalizePath(req.files.thumbnail[0].path) : null,
      screenshots: req.files.screenshots ? req.files.screenshots.map(f => normalizePath(f.path)) : [],
      files: req.files.files ? req.files.files.map(f => ({
        filename: f.filename,
        originalName: f.originalname,
        size: f.size,
        fileType: f.mimetype,
        storageUrl: normalizePath(f.path)
      })) : []
    };

    res.json({ message: 'Files uploaded successfully', ...response });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading files' });
  }
});

// Download file
router.get('/download/:fileId', downloadLimiter, optionalAuth, itemController.downloadFile);

module.exports = router;
