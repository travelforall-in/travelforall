// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Adjust this in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files for frontend (if you have a frontend build)
// Uncomment and adjust when you have a frontend build
// app.use(express.static(path.join(__dirname, 'frontend/build')));

// Route registration with error handling
console.log('Registering routes...');

try {
  // Core authentication routes
  app.use('/api/auth', require('./routes/authRoutes'));
  console.log('✓ Auth routes registered');

  // Admin routes
  app.use('/api/admin', require('./routes/adminRoutes'));
  console.log('✓ Admin routes registered');

  // Package routes
  app.use('/api/packages', require('./routes/packageRoutes'));
  console.log('✓ Package routes registered');

  // Booking routes
  app.use('/api/bookings', require('./routes/bookingRoutes'));
  console.log('✓ Booking routes registered');

  // State routes
  app.use('/api/states', require('./routes/stateRoutes'));
  console.log('✓ State routes registered');

  // User-related routes
  app.use('/api/users', require('./routes/userRoutes'));
  console.log('✓ User routes registered');

  // Custom packages and wishlist routes
  app.use('/api/custom-packages', require('./routes/customPackageRoutes'));
  console.log('✓ Custom package routes registered');
  
  app.use('/api/wishlist', require('./routes/wishlistRoutes'));
  console.log('✓ Wishlist routes registered');
  
  app.use('/api/admin/custom-packages', require('./routes/adminCustomPackageRoutes'));
  console.log('✓ Admin custom package routes registered');

  // Cities routes
  app.use('/api/cities', require('./routes/cityRoutes'));
  console.log('✓ City routes registered');

  // Location, hotel, and transportation routes
  app.use('/api/locations', require('./routes/locationRoutes'));
  console.log('✓ Location routes registered');
  
  app.use('/api/hotels', require('./routes/hotelRoutes'));
  console.log('✓ Hotel routes registered');
  
  app.use('/api/transportation', require('./routes/transportationRoutes'));
  console.log('✓ Transportation routes registered');

  // NEW VENDOR SYSTEM ROUTES
  app.use('/api/vendor', require('./routes/vendorRoutes'));
  console.log('✓ Vendor routes registered');
  
  app.use('/api/admin/vendors', require('./routes/adminVendorRoutes'));
  console.log('✓ Admin vendor routes registered');
  
  app.use('/api/hotel-bookings', require('./routes/hotelBookingRoutes'));
  console.log('✓ Hotel booking routes registered');

  console.log('All routes registered successfully!');

} catch (error) {
  console.error('Error registering routes:', error);
  console.error('Make sure all route files exist and are properly structured');
}

// Home route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Travel Booking API is running successfully!',
    features: [
      'User Authentication & Authorization',
      'Package Management (Domestic & International)',
      'Booking System',
      'Custom Package Requests',
      'Wishlist Management',
      'City & Location Management',
      'Hotel Management',
      'Transportation System',
      'Vendor Admin System',
      'Hotel Booking System',
      'Admin Dashboard',
      'Vendor Dashboard',
      'Analytics & Reporting'
    ],
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      packages: '/api/packages',
      bookings: '/api/bookings',
      users: '/api/users',
      customPackages: '/api/custom-packages',
      wishlist: '/api/wishlist',
      cities: '/api/cities',
      locations: '/api/locations',
      hotels: '/api/hotels',
      transportation: '/api/transportation',
      vendor: '/api/vendor',
      adminVendors: '/api/admin/vendors',
      hotelBookings: '/api/hotel-bookings'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API documentation route (basic)
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Travel Booking API Documentation',
    version: '1.0.0',
    endpoints: {
      // Authentication & User Management
      'POST /api/auth/register': 'User registration',
      'POST /api/auth/login': 'User login',
      'POST /api/auth/admin/register': 'Admin registration',
      'POST /api/auth/admin/login': 'Admin login',
      'GET /api/auth/me': 'Get current user',
      'POST /api/auth/logout': 'Logout',
      
      // Vendor Authentication
      'POST /api/vendor/auth/register': 'Vendor registration',
      'POST /api/vendor/auth/login': 'Vendor login',
      'GET /api/vendor/auth/me': 'Get vendor profile',
      'PUT /api/vendor/auth/profile': 'Update vendor profile',
      
      // Package Management
      'GET /api/packages': 'Get all packages',
      'POST /api/packages': 'Create package (Admin)',
      'GET /api/packages/:id': 'Get single package',
      'PUT /api/packages/:id': 'Update package (Admin)',
      'DELETE /api/packages/:id': 'Delete package (Admin)',
      
      // Booking Management
      'POST /api/bookings': 'Create booking',
      'GET /api/bookings': 'Get user bookings',
      'GET /api/bookings/:id': 'Get single booking',
      'PUT /api/bookings/:id/cancel': 'Cancel booking',
      
      // Hotel Management (Vendor)
      'POST /api/vendor/hotels': 'Create hotel (Vendor)',
      'GET /api/vendor/hotels': 'Get vendor hotels',
      'GET /api/vendor/hotels/:id': 'Get single hotel',
      'PUT /api/vendor/hotels/:id': 'Update hotel (Vendor)',
      'DELETE /api/vendor/hotels/:id': 'Delete hotel (Vendor)',
      
      // Hotel Booking System
      'POST /api/hotel-bookings': 'Create hotel booking',
      'GET /api/hotel-bookings': 'Get user hotel bookings',
      'GET /api/hotel-bookings/:id': 'Get single hotel booking',
      'PUT /api/hotel-bookings/:id/cancel': 'Cancel hotel booking',
      
      // Vendor Management (Admin)
      'GET /api/admin/vendors': 'Get all vendors (Admin)',
      'GET /api/admin/vendors/:id': 'Get single vendor (Admin)',
      'PUT /api/admin/vendors/:id/status': 'Update vendor status (Admin)',
      'DELETE /api/admin/vendors/:id': 'Delete vendor (Admin)',
      
      // Dashboard Analytics
      'GET /api/vendor/dashboard/stats': 'Vendor dashboard stats',
      'GET /api/vendor/dashboard/revenue': 'Vendor revenue analytics',
      'GET /api/admin/dashboard': 'Admin dashboard stats',
      
      // Location & City Management
      'GET /api/locations': 'Get all locations',
      'GET /api/cities': 'Get all cities',
      'GET /api/hotels': 'Get all hotels',
      'GET /api/transportation': 'Get transportation options'
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`,
    availableEndpoints: '/api'
  });
});

// Catch-all route for frontend routing (uncomment when you have frontend)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
// });

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 TRAVEL BOOKING API SERVER STARTED');
  console.log('='.repeat(50));
  console.log(`📍 Server running on: http://${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API Documentation: http://${HOST}:${PORT}/api`);
  console.log(`❤️  Health Check: http://${HOST}:${PORT}/health`);
  console.log('='.repeat(50));
  console.log('Available Features:');
  console.log('✓ User Authentication & Management');
  console.log('✓ Package Management System');
  console.log('✓ Booking Management System');
  console.log('✓ Vendor Admin System');
  console.log('✓ Hotel Management System');
  console.log('✓ Hotel Booking System');
  console.log('✓ Location & Transportation');
  console.log('✓ Analytics & Dashboard');
  console.log('✓ Custom Package Requests');
  console.log('✓ Wishlist Management');
  console.log('='.repeat(50));
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('✓ Server closed successfully');
    console.log('✓ Database connections closed');
    console.log('👋 Goodbye!');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forceful shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('🚨 Unhandled Promise Rejection:');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Close server & exit process
  server.close(() => {
    console.error('💀 Server closed due to unhandled promise rejection');
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Close server & exit process
  server.close(() => {
    console.error('💀 Server closed due to uncaught exception');
    process.exit(1);
  });
});

// Handle warning events
process.on('warning', (warning) => {
  console.warn('⚠️ Warning:', warning.name);
  console.warn('Message:', warning.message);
  console.warn('Stack:', warning.stack);
});

module.exports = app;