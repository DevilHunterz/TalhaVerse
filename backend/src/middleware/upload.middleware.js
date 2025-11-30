const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = file.fieldname === 'thumbnail' || file.fieldname === 'screenshots' 
      ? path.join(uploadDir, 'images')
      : path.join(uploadDir, 'files');
    
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }
    cb(null, subDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedFileTypes = /zip|rar|jar|mcpack|mcaddon|mcworld/;
  
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (file.fieldname === 'thumbnail' || file.fieldname === 'screenshots') {
    if (allowedImageTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for thumbnails and screenshots'));
    }
  } else if (file.fieldname === 'files') {
    if (allowedFileTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: .zip, .rar, .jar, .mcpack, .mcaddon, .mcworld'));
    }
  } else {
    cb(null, true);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024 // 500MB default
  }
});

module.exports = upload;
