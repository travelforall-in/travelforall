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


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
// server.js - Add this line
app.use('/api/states', require('./routes/stateRoutes'));

// User-related routes
app.use('/api/users', require('./routes/userRoutes'));

// Custom packages and wishlist routes
app.use('/api/custom-packages', require('./routes/customPackageRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/admin/custom-packages', require('./routes/adminCustomPackageRoutes'));

// Cities routes
app.use('/api/cities', require('./routes/cityRoutes'));

// New location, hotel, and transportation routes
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/transportation', require('./routes/transportationRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));


// Home route
app.get('/', (req, res) => {
  res.send('Travel Booking API is running with Cities, Locations, Hotels, Transportation, Custom Package and Wishlist features');
});

// Catch-all route for frontend routing (uncomment when you have frontend)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
// });

// Error handling middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;