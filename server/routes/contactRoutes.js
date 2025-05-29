const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');

// POST /api/contact
router.post('/', submitContactForm);

module.exports = router;
