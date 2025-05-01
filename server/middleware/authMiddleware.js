const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const Admin = require('../models/Admin');
const BlacklistedToken = require('../models/BlacklistedToken');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Get token from cookie as well
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Check if token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({
        success: false,
        message: 'Token has been invalidated, please login again',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Find user with the id in the token
    let user = await User.findById(decoded.id);
    
    // If not a user, check if it's an admin
    if (!user) {
      user = await Admin.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Set token cookie helper
exports.sendTokenCookie = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + config.jwtCookieExpire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Add secure flag in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
    });
};