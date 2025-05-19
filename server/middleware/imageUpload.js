// middleware/imageUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const createDirectories = () => {
  const directories = [
    './uploads',
    './uploads/packages',
    './uploads/hotels',
    './uploads/locations',
    './uploads/transportation',
    './uploads/cities',
    './uploads/states', // Added directory for states
    './uploads/users'   // Ensure user uploads directory exists
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Call this on application startup
createDirectories();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads/packages'; // Default path
    
    // Determine the destination based on the route
    if (req.originalUrl.includes('/hotels')) {
      uploadPath = './uploads/hotels';
    } else if (req.originalUrl.includes('/locations')) {
      uploadPath = './uploads/locations';
    } else if (req.originalUrl.includes('/transportation')) {
      uploadPath = './uploads/transportation';
    } else if (req.originalUrl.includes('/cities')) {
      uploadPath = './uploads/cities';
    } else if (req.originalUrl.includes('/states')) {
      uploadPath = './uploads/states';
    } else if (req.originalUrl.includes('/users')) {
      uploadPath = './uploads/users';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Determine prefix based on upload type
    let prefix = 'package';
    
    if (req.originalUrl.includes('/hotels')) {
      prefix = 'hotel';
    } else if (req.originalUrl.includes('/locations')) {
      prefix = 'location';
    } else if (req.originalUrl.includes('/transportation')) {
      prefix = 'transport';
    } else if (req.originalUrl.includes('/cities')) {
      prefix = 'city';
    } else if (req.originalUrl.includes('/states')) {
      prefix = 'state';
    } else if (req.originalUrl.includes('/users')) {
      prefix = 'user';
    }
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter to allow only image files
const imageFilter = (req, file, cb) => {
  // Accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

module.exports = upload;