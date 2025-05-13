const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// Send JWT token in response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Extract user data without password
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
  });
};

module.exports = {
  generateToken,
  sendTokenResponse,
};