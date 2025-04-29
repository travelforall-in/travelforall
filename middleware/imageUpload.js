const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/packages');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `package-${uniqueSuffix}${path.extname(file.originalname)}`);
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