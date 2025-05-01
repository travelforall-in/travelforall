// Admin middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.'
      });
    }
  };
  
  module.exports = adminMiddleware;