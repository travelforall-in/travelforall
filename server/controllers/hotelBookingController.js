// controllers/hotelBookingController.js
const HotelBooking = require('../models/HotelBooking');
const { Hotel } = require('../models/Hotel');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Create hotel booking
// @route   POST /api/hotel-bookings
// @access  Private/User
exports.createHotelBooking = async (req, res) => {
  try {
    const {
      hotelId,
      roomDetails,
      guestDetails,
      stayDetails,
      contactDetails,
      specialRequests,
      paymentMethod
    } = req.body;

    // Validate hotel ID
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID',
      });
    }

    // Find the hotel and get vendor info
    const hotel = await Hotel.findById(hotelId)
      .populate('vendor', '_id name')
      .populate('location', 'name country');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    // Check if hotel is active
    if (hotel.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Hotel is not available for booking',
      });
    }

    // Validate dates
    const checkInDate = new Date(stayDetails.checkInDate);
    const checkOutDate = new Date(stayDetails.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past',
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
    }

    // Validate guest details
    if (!guestDetails || guestDetails.adults < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least one adult guest is required',
      });
    }

    // Check room availability (simplified - you might want more complex logic)
    const existingBookings = await HotelBooking.countDocuments({
      hotel: hotelId,
      bookingStatus: { $in: ['confirmed', 'checked_in'] },
      $or: [
        {
          'stayDetails.checkInDate': {
            $lte: checkOutDate,
            $gte: checkInDate
          }
        },
        {
          'stayDetails.checkOutDate': {
            $lte: checkOutDate,
            $gte: checkInDate
          }
        },
        {
          $and: [
            { 'stayDetails.checkInDate': { $lte: checkInDate } },
            { 'stayDetails.checkOutDate': { $gte: checkOutDate } }
          ]
        }
      ]
    });

    // Simple availability check (assuming 20 rooms per hotel - adjust as needed)
    const totalRoomsBooked = existingBookings;
    const requestedRooms = roomDetails.numberOfRooms;
    const estimatedTotalRooms = 20; // This should come from hotel data

    if (totalRoomsBooked + requestedRooms > estimatedTotalRooms) {
      return res.status(400).json({
        success: false,
        message: 'Requested rooms not available for selected dates',
      });
    }

    // Prepare booking data
    const bookingData = {
      user: req.user._id,
      hotel: hotelId,
      vendor: hotel.vendor ? hotel.vendor._id : null,
      roomDetails: {
        roomType: roomDetails.roomType,
        numberOfRooms: parseInt(roomDetails.numberOfRooms),
        pricePerRoom: parseFloat(roomDetails.pricePerRoom)
      },
      guestDetails: {
        adults: parseInt(guestDetails.adults),
        children: parseInt(guestDetails.children || 0),
        infants: parseInt(guestDetails.infants || 0)
      },
      stayDetails: {
        checkInDate: checkInDate,
        checkOutDate: checkOutDate
      },
      contactDetails,
      paymentDetails: {
        paymentMethod: paymentMethod || 'credit_card',
        paymentStatus: 'pending'
      },
      specialRequests,
      bookingStatus: 'pending'
    };

    // Create booking (pre-save middleware will handle calculations)
    const booking = await HotelBooking.create(bookingData);

    // Update hotel booking count
    await Hotel.findByIdAndUpdate(hotelId, {
      $inc: { totalBookings: 1 }
    });

    // Populate booking for response
    const populatedBooking = await HotelBooking.findById(booking._id)
      .populate('hotel', 'name address category images contactInfo')
      .populate('vendor', 'name vendorDetails.companyName');

    res.status(201).json({
      success: true,
      message: 'Hotel booking created successfully',
      data: populatedBooking,
    });
  } catch (error) {
    console.error('Hotel Booking Creation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's hotel bookings
// @route   GET /api/hotel-bookings
// @access  Private/User
exports.getUserHotelBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Create query
    const query = { user: userId };

    // Optional filters
    if (req.query.bookingStatus) {
      query.bookingStatus = req.query.bookingStatus;
    }

    if (req.query.paymentStatus) {
      query['paymentDetails.paymentStatus'] = req.query.paymentStatus;
    }

    // Date range filtering
    if (req.query.checkInStart && req.query.checkInEnd) {
      query['stayDetails.checkInDate'] = {
        $gte: new Date(req.query.checkInStart),
        $lte: new Date(req.query.checkInEnd)
      };
    }

    // Execute query
    const bookings = await HotelBooking.find(query)
      .populate('hotel', 'name address category images location')
      .populate('hotel.location', 'name country')
      .populate('vendor', 'name vendorDetails.companyName')
      .sort('-createdAt')
      .limit(limit)
      .skip(skipIndex);

    // Count total documents
    const total = await HotelBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: bookings,
    });
  } catch (error) {
    console.error('Get User Hotel Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single hotel booking
// @route   GET /api/hotel-bookings/:id
// @access  Private/User
exports.getHotelBooking = async (req, res) => {
  try {
    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const booking = await HotelBooking.findById(req.params.id)
      .populate('hotel', 'name address description category images location contactInfo policies')
      .populate('hotel.location', 'name country region')
      .populate('vendor', 'name vendorDetails.companyName vendorDetails.contactPerson')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user owns this booking or is admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get Hotel Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel hotel booking
// @route   PUT /api/hotel-bookings/:id/cancel
// @access  Private/User
exports.cancelHotelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const booking = await HotelBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.bookingStatus === 'checked_out') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking',
      });
    }

    // Check cancellation policy (simplified)
    const checkInDate = new Date(booking.stayDetails.checkInDate);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

    let refundStatus = 'not_applicable';
    if (hoursUntilCheckIn >= 48) {
      refundStatus = 'processed';
      booking.paymentDetails.paymentStatus = 'refunded';
    } else if (hoursUntilCheckIn >= 24) {
      refundStatus = 'pending';
    } else {
      refundStatus = 'rejected';
    }

    // Update booking
    booking.bookingStatus = 'cancelled';
    booking.cancellationDetails = {
      cancelledAt: new Date(),
      cancelledBy: 'user',
      cancellationReason: cancellationReason || 'Cancelled by user',
      refundStatus
    };

    await booking.save();

    // Update hotel booking count
    await Hotel.findByIdAndUpdate(booking.hotel, {
      $inc: { totalBookings: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Cancel Hotel Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all hotel bookings (Admin only)
// @route   GET /api/hotel-bookings/admin/all
// @access  Private/Admin
exports.getAllHotelBookings = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Create query
    const query = {};

    // Optional filters
    if (req.query.bookingStatus) query.bookingStatus = req.query.bookingStatus;
    if (req.query.paymentStatus) query['paymentDetails.paymentStatus'] = req.query.paymentStatus;
    if (req.query.vendorId) query.vendor = req.query.vendorId;
    if (req.query.hotelId) query.hotel = req.query.hotelId;

    // Date range filtering
    if (req.query.checkInStart && req.query.checkInEnd) {
      query['stayDetails.checkInDate'] = {
        $gte: new Date(req.query.checkInStart),
        $lte: new Date(req.query.checkInEnd)
      };
    }

    // Sorting
    const sortOptions = {};
    if (req.query.sortBy) {
      const [field, order] = req.query.sortBy.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    // Execute query
    const bookings = await HotelBooking.find(query)
      .populate('user', 'name email phone')
      .populate('hotel', 'name address category')
      .populate('vendor', 'name vendorDetails.companyName')
      .sort(sortOptions)
      .limit(limit)
      .skip(skipIndex);

    // Count total documents
    const total = await HotelBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: bookings,
    });
  } catch (error) {
    console.error('Get All Hotel Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update hotel booking status (Admin only)
// @route   PUT /api/hotel-bookings/admin/:id/status
// @access  Private/Admin
exports.updateHotelBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus, adminNotes } = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    // Find the booking
    let booking = await HotelBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Validate and update booking status
    const validBookingStatuses = ['confirmed', 'pending', 'cancelled', 'checked_in', 'checked_out', 'no_show'];
    if (bookingStatus) {
      if (!validBookingStatuses.includes(bookingStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid booking status',
        });
      }
      booking.bookingStatus = bookingStatus;
    }

    // Validate and update payment status
    const validPaymentStatuses = ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'];
    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment status',
        });
      }
      booking.paymentDetails.paymentStatus = paymentStatus;
    }

    // Add admin notes
    if (adminNotes) {
      booking.adminNotes = adminNotes;
    }

    // Save the updated booking
    await booking.save();

    // Populate for detailed response
    await booking.populate('user', 'name email');
    await booking.populate('hotel', 'name address category');
    await booking.populate('vendor', 'name vendorDetails.companyName');

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Update Hotel Booking Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get hotel booking analytics (Admin only)
// @route   GET /api/hotel-bookings/admin/analytics
// @access  Private/Admin
exports.getHotelBookingAnalytics = async (req, res) => {
  try {
    const [
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      monthlyBookings,
      topVendors,
      topHotels,
      bookingTrends
    ] = await Promise.all([
      // Total bookings
      HotelBooking.countDocuments(),
      
      // Confirmed bookings
      HotelBooking.countDocuments({ bookingStatus: 'confirmed' }),
      
      // Pending bookings
      HotelBooking.countDocuments({ bookingStatus: 'pending' }),
      
      // Cancelled bookings
      HotelBooking.countDocuments({ bookingStatus: 'cancelled' }),
      
      // Total revenue
      HotelBooking.aggregate([
        { $match: { 'paymentDetails.paymentStatus': 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      
      // Monthly bookings
      HotelBooking.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      
      // Top vendors by bookings
      HotelBooking.aggregate([
        {
          $group: {
            _id: '$vendor',
            bookings: { $sum: 1 },
            revenue: { $sum: '$pricing.totalAmount' }
          }
        },
        { $sort: { bookings: -1 } },
        { $limit: 5 }
      ]),
      
      // Top hotels by bookings
      HotelBooking.aggregate([
        {
          $group: {
            _id: '$hotel',
            bookings: { $sum: 1 },
            revenue: { $sum: '$pricing.totalAmount' }
          }
        },
        { $sort: { bookings: -1 } },
        { $limit: 5 }
      ]),
      
      // Booking trends (last 30 days)
      HotelBooking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
            },
            bookings: { $sum: 1 },
            revenue: { $sum: '$pricing.totalAmount' }
          }
        },
        { $sort: { '_id.date': 1 } }
      ])
    ]);

    const revenue = totalRevenue[0] ? totalRevenue[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalBookings,
          confirmedBookings,
          pendingBookings,
          cancelledBookings,
          totalRevenue: revenue,
          monthlyBookings
        },
        topPerformers: {
          vendors: topVendors,
          hotels: topHotels
        },
        trends: bookingTrends
      }
    });
  } catch (error) {
    console.error('Get Hotel Booking Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};