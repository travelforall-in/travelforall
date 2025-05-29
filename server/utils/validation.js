// utils/validation.js (Complete updated version)
const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validate = (validations) => {
  return async (req, res, next) => {
    // Parse JSON-like string fields
    const fieldsToParseAsJSON = [
      'highlights', 
      'inclusions', 
      'exclusions', 
      'itinerary',
      'amenities',
      'roomTypes',
      'contactInfo',
      'policies',
      'priceRange',
      'routes',
      'destinations',
      'bookingInformation',
      'attractions',
      'travelTips',
      'weather',
      'popularAttractions',  // Added for cities
      'localCuisine'         // Added for cities
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
    if (req.body.budget) req.body.budget = parseFloat(req.body.budget);
    if (req.body.rating) req.body.rating = parseFloat(req.body.rating);
    if (req.body.featured !== undefined) req.body.featured = req.body.featured === 'true';

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

// Common validation rules
exports.registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  
  body('email')
    .isEmail()
    .withMessage('Please include a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
];

exports.loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please include a valid email'),
  
  body('password')
    .exists()
    .withMessage('Password is required')
];

// Package validation rules with city as optional
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
  
  body('city')
    .optional() // Changed from notEmpty to optional
    .isMongoId()
    .withMessage('If provided, City ID must be a valid MongoDB ObjectId'),
  
  body('duration.days')
    .notEmpty()
    .withMessage('Number of days is required')
    .isInt({ min: 1 })
    .withMessage('Days must be a positive number'),
  
  body('duration.nights')
    .notEmpty()
    .withMessage('Number of nights is required')
    .isInt({ min: 0 })
    .withMessage('Nights must be a non-negative number'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('highlights')
    .custom((value) => {
      if (Array.isArray(value)) {
        if (value.length < 1) {
          throw new Error('At least one highlight is required');
        }
        return true;
      } else if (typeof value === 'string') {
        // Will be parsed to JSON in validate middleware
        return true;
      }
      throw new Error('Highlights must be an array');
    }),
  
  body('transportation')
    .notEmpty()
    .withMessage('Transportation is required')
    .isIn(['flight', 'train', 'bus', 'cruise', 'self-drive', 'mixed'])
    .withMessage('Invalid transportation type'),
  
  body('accommodation')
    .notEmpty()
    .withMessage('Accommodation is required')
];

// City validation rules
exports.cityValidation = [
  body('name')
    .notEmpty()
    .withMessage('City name is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name cannot be more than 100 characters'),
  
  body('country')
    .notEmpty()
    .withMessage('Country name is required')
    .trim(),
  
  body('type')
    .notEmpty()
    .withMessage('City type is required')
    .isIn(['domestic', 'international'])
    .withMessage('City type must be either domestic or international'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  
  body('weather')
    .notEmpty()
    .withMessage('Weather information is required'),
  
  body('bestTimeToVisit')
    .notEmpty()
    .withMessage('Best time to visit is required'),
  
  body('popularAttractions')
    .notEmpty()
    .withMessage('Popular attractions are required')
    .custom((value) => {
      if (Array.isArray(value)) {
        if (value.length < 1) {
          throw new Error('At least one popular attraction is required');
        }
        return true;
      } else if (typeof value === 'string') {
        // Will be parsed to JSON in validate middleware
        return true;
      }
      throw new Error('Popular attractions must be an array');
    }),
  
  body('localCuisine')
    .optional()
    .custom((value) => {
      if (Array.isArray(value) || typeof value === 'string') {
        return true;
      }
      throw new Error('Local cuisine must be an array');
    }),
  
  body('transportation')
    .notEmpty()
    .withMessage('Transportation information is required'),
  
  body('culturalNotes')
    .optional()
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
    .withMessage('Invalid phone number')
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

// Location validation
exports.locationValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),
  
  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .trim(),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  
  body('region')
    .optional()
    .trim(),
  
  body('bestTimeToVisit')
    .optional()
    .trim(),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  
  body('popularityIndex')
    .optional()
    .isNumeric()
    .withMessage('Popularity index must be a number'),
  
  body('attractions')
    .optional()
    .isArray()
    .withMessage('Attractions must be an array'),
  
  body('travelTips')
    .optional()
    .isArray()
    .withMessage('Travel tips must be an array')
];

// Hotel validation
exports.hotelValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),
  
  body('location')
    .notEmpty()
    .withMessage('Location ID is required')
    .isMongoId()
    .withMessage('Invalid location ID format'),
  
  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .trim(),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['budget', 'standard', 'premium', 'luxury', 'resort'])
    .withMessage('Invalid category'),
  
  body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('priceRange.min')
    .notEmpty()
    .withMessage('Minimum price is required')
    .isNumeric()
    .withMessage('Minimum price must be a number'),
  
  body('priceRange.max')
    .notEmpty()
    .withMessage('Maximum price is required')
    .isNumeric()
    .withMessage('Maximum price must be a number')
    .custom((value, { req }) => {
      const min = parseFloat(req.body.priceRange.min);
      const max = parseFloat(value);
      if (max <= min) {
        throw new Error('Maximum price must be greater than minimum price');
      }
      return true;
    }),
  
  body('roomTypes')
    .optional()
    .isArray()
    .withMessage('Room types must be an array'),
  
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value')
];

// Hotel review validation
exports.hotelReviewValidation = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  
  body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .trim()
];

// Transportation validation
exports.transportationValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),
  
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['bus', 'train', 'flight', 'ferry', 'cruise', 'taxi'])
    .withMessage('Invalid transportation type'),
  
  body('operator')
    .notEmpty()
    .withMessage('Operator name is required')
    .trim(),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  
  body('destinations')
    .optional()
    .isArray()
    .withMessage('Destinations must be an array'),
  
  body('routes')
    .optional()
    .isArray()
    .withMessage('Routes must be an array'),
  
  body('routes.*.from')
    .optional()
    .isMongoId()
    .withMessage('From location ID must be valid'),
  
  body('routes.*.to')
    .optional()
    .isMongoId()
    .withMessage('To location ID must be valid'),
  
  body('routes.*.price')
    .optional()
    .isNumeric()
    .withMessage('Route price must be a number'),
  
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value')
];

// Transportation review validation
exports.transportationReviewValidation = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  
  body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .trim()
];