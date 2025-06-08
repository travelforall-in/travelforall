// middleware/vendorMiddleware.js
const jwt = require('jsonwebtoken');
const VendorAdmin = require('../models/VendorAdmin');
const config = require('../config/config');

// Protect vendor routes
exports.protectVendor = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route - no token provided'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get vendor from database
    const vendor = await VendorAdmin.findById(decoded.id).select('-password');

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Check if vendor is active
    if (vendor.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: `Access denied. Vendor account status: ${vendor.status}`
      });
    }

    // Check if role is vendor
    if (vendor.role !== 'vendor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Vendor role required'
      });
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    console.error('Vendor auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route - invalid token'
    });
  }
};

// Authorize vendor for specific resources
exports.authorizeVendorResource = (resourceType) => {
  return async (req, res, next) => {
    try {
      const vendorId = req.vendor._id;
      const resourceId = req.params.id;

      let hasAccess = false;

      switch (resourceType) {
        case 'hotel':
          const Hotel = require('../models/Hotel').Hotel;
          const hotel = await Hotel.findById(resourceId);
          if (hotel && hotel.vendor.toString() === vendorId.toString()) {
            hasAccess = true;
          }
          break;

        case 'hotel_booking':
          const HotelBooking = require('../models/HotelBooking');
          const booking = await HotelBooking.findById(resourceId);
          if (booking && booking.vendor.toString() === vendorId.toString()) {
            hasAccess = true;
          }
          break;

        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid resource type'
          });
      }

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not own this resource'
        });
      }

      next();
    } catch (error) {
      console.error('Resource authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking resource authorization'
      });
    }
  };
};

// Check if vendor owns hotel
exports.checkHotelOwnership = async (req, res, next) => {
  try {
    const vendorId = req.vendor._id;
    const hotelId = req.params.hotelId || req.body.hotelId || req.params.id;

    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID is required'
      });
    }

    const Hotel = require('../models/Hotel').Hotel;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    if (hotel.vendor.toString() !== vendorId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this hotel'
      });
    }

    req.hotel = hotel;
    next();
  } catch (error) {
    console.error('Hotel ownership check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking hotel ownership'
    });
  }
};

// Admin or Vendor access (for main admin to view vendor data)
exports.protectAdminOrVendor = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route - no token provided'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Try to find as admin first
    const Admin = require('../models/Admin');
    let user = await Admin.findById(decoded.id).select('-password');
    
    if (user && user.role === 'admin') {
      req.user = user;
      req.userType = 'admin';
      return next();
    }

    // Try to find as vendor
    user = await VendorAdmin.findById(decoded.id).select('-password');
    
    if (user && user.role === 'vendor' && user.status === 'active') {
      req.vendor = user;
      req.userType = 'vendor';
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });

  } catch (error) {
    console.error('Admin/Vendor auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route - invalid token'
    });
  }
};

module.exports = exports;