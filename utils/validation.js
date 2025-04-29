const { body, validationResult } = require('express-validator');




// Common validation rules
exports.registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),
];






// Booking validation rules
exports.bookingValidation = [
  body('packageId')
    .notEmpty()
    .withMessage('Package ID is required'),
  
  body('travelDate')
    .notEmpty()
    .withMessage('Travel date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('travelers.adults')
    .notEmpty()
    .withMessage('Number of adults is required')
    .isInt({ min: 1 })
    .withMessage('At least one adult is required'),
  
  body('travelers.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of children must be a non-negative integer'),
  
  body('travelers.infants')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of infants must be a non-negative integer'),
  
  body('contactDetails.email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  
  body('contactDetails.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
];




// Validation middleware
exports.validate = (validations) => {
  return async (req, res, next) => {
    // Parse JSON-like string fields
    const fieldsToParseAsJSON = [
      'highlights', 
      'inclusions', 
      'exclusions', 
      'itinerary'
    ];

    fieldsToParseAsJSON.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (error) {
          console.warn(`Could not parse ${field}:`, req.body[field]);
        }
      }
    });

    // Handle nested duration
    if (req.body['duration.days'] || req.body['duration.nights']) {
      req.body.duration = {
        days: parseInt(req.body['duration.days']),
        nights: parseInt(req.body['duration.nights'])
      };
    }

    // Convert primitive fields
    if (req.body.price) req.body.price = parseFloat(req.body.price);
    if (req.body.featured) req.body.featured = req.body.featured === 'true';

    // Run validations
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

// Package validation rules
exports.packageValidation = [
  body('name')
    .notEmpty()
    .withMessage('Package name is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Package name cannot be more than 100 characters'),
  
  body('type')
    .notEmpty()
    .withMessage('Package type is required')
    .isIn(['domestic', 'international'])
    .withMessage('Type must be either domestic or international'),
  
  body('destination')
    .notEmpty()
    .withMessage('Destination is required'),
  
  body('duration.days')
    .notEmpty()
    .withMessage('Number of days is required')
    .isInt({ min: 1 })
    .withMessage('Days must be a positive number'),
  
  body('duration.nights')
    .notEmpty()
    .withMessage('Number of nights is required')
    .isInt({ min: 1 })
    .withMessage('Nights must be a positive number'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('highlights')
    .isArray()
    .withMessage('Highlights must be an array'),
  
  body('transportation')
    .notEmpty()
    .withMessage('Transportation is required')
    .isIn(['flight', 'train', 'bus', 'cruise', 'self-drive', 'mixed'])
    .withMessage('Invalid transportation type'),
  
  body('accommodation')
    .notEmpty()
    .withMessage('Accommodation is required'),
];














// utils/validation.js - Add this to your existing validation file

// Custom Package validation schema
exports.customPackageValidation = [
  // Basic info validation
  body('name')
    .notEmpty()
    .withMessage('Package name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  
  body('destination')
    .notEmpty()
    .withMessage('Destination is required'),
  
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const startDate = new Date(value);
      const currentDate = new Date();
      if (startDate < currentDate) {
        throw new Error('Start date must be in the future');
      }
      return true;
    }),
  
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  // Accommodation validation
  body('accommodation.type')
    .notEmpty()
    .withMessage('Accommodation type is required')
    .isIn(['hotel', 'resort', 'hostel', 'guesthouse', 'apartment'])
    .withMessage('Invalid accommodation type'),
  
  body('accommodation.preferredRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  // Transportation validation  
  body('transportation.flights.preferredClass')
    .optional()
    .isIn(['economy', 'premium_economy', 'business', 'first'])
    .withMessage('Invalid flight class'),
  
  body('transportation.localTransport')
    .optional()
    .isIn(['public', 'private', 'rental'])
    .withMessage('Invalid local transport option'),
  
  // Budget validation
  body('budget')
    .notEmpty()
    .withMessage('Budget is required')
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Budget must be greater than 0');
      }
      return true;
    }),
  
  // Travelers validation
  body('travelers.adults')
    .notEmpty()
    .withMessage('Number of adults is required')
    .isInt({ min: 1 })
    .withMessage('At least one adult is required'),
  
  body('travelers.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Children count must be a non-negative number'),
  
  body('travelers.infants')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Infants count must be a non-negative number')
];



// Custom Package validation schema
exports.customPackageValidation = [
  // Basic info validation
  body('name')
    .notEmpty()
    .withMessage('Package name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  
  body('destination')
    .notEmpty()
    .withMessage('Destination is required'),
  
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const startDate = new Date(value);
      const currentDate = new Date();
      if (startDate < currentDate) {
        throw new Error('Start date must be in the future');
      }
      return true;
    }),
  
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  // Accommodation validation
  body('accommodation.type')
    .notEmpty()
    .withMessage('Accommodation type is required')
    .isIn(['hotel', 'resort', 'hostel', 'guesthouse', 'apartment'])
    .withMessage('Invalid accommodation type'),
  
  body('accommodation.preferredRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  // Transportation validation  
  body('transportation.flights.preferredClass')
    .optional()
    .isIn(['economy', 'premium_economy', 'business', 'first'])
    .withMessage('Invalid flight class'),
  
  body('transportation.localTransport')
    .optional()
    .isIn(['public', 'private', 'rental'])
    .withMessage('Invalid local transport option'),
  
  // Budget validation
  body('budget')
    .notEmpty()
    .withMessage('Budget is required')
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Budget must be greater than 0');
      }
      return true;
    }),
  
  // Travelers validation
  body('travelers.adults')
    .notEmpty()
    .withMessage('Number of adults is required')
    .isInt({ min: 1 })
    .withMessage('At least one adult is required'),
  
  body('travelers.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Children count must be a non-negative number'),
  
  body('travelers.infants')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Infants count must be a non-negative number')
];