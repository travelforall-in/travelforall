const express = require('express');
const router = express.Router();
const { submitTestimonial, getTestimonials } = require('../controllers/testimonialController');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/', upload.single('image'), submitTestimonial);

// 🆕 Add this GET route
router.get('/', getTestimonials);

module.exports = router;
