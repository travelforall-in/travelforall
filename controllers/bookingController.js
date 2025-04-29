//bookingController.js
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const mongoose = require('mongoose');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      packageId,
      travelDate,
      travelers,
      travelerDetails,
      contactDetails,
      specialRequests,
    } = req.body;

    // Validate package ID
    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID',
      });
    }

    // Find the package
    const package = await Package.findById(packageId);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    // Validate travelers
    if (!travelers || travelers.adults < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least one adult traveler is required',
      });
    }

    // Calculate total price based on number of travelers
    const totalAdults = travelers.adults || 0;
    const totalChildren = travelers.children || 0;
    const totalInfants = travelers.infants || 0;

    // Assuming children pay 70% of adult price and infants are free
    const totalPrice = 
      package.price * totalAdults + 
      package.price * 0.7 * totalChildren;

    // Create new booking
    const booking = await Booking.create({
      user: req.user._id,
      package: packageId,
      travelDate: new Date(travelDate),
      travelers,
      travelerDetails,
      contactDetails,
      totalPrice,
      specialRequests,
      bookingStatus: 'pending',
      paymentStatus: 'pending'
    });

    // Increment bookings count for the package
    package.bookingsCount = (package.bookingsCount || 0) + 1;
    await package.save();

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Booking Creation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'package',
        select: 'name type destination price duration images'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get User Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'package',
        select: 'name type destination price duration itinerary inclusions exclusions images'
      })
      .populate({
        path: 'user',
        select: 'name email phone'
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Make sure user is booking owner or admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Make sure user is booking owner
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    // Check if booking is already cancelled
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Decrement bookings count for the package
    const package = await Package.findById(booking.package);
    if (package) {
      package.bookingsCount = Math.max((package.bookingsCount || 0) - 1, 0);
      await package.save();
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'package',
        select: 'name type destination'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get All Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};