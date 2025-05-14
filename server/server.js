import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/db.js';
import errorMiddleware from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import customPackageRoutes from './routes/customPackageRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import adminCustomPackageRoutes from './routes/adminCustomPackageRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import transportationRoutes from './routes/transportationRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));

// Static file support
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/custom-packages', customPackageRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin/custom-packages', adminCustomPackageRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/transportation', transportationRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Travel Booking API is running');
});

// Error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
});

// Global error handling
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});
