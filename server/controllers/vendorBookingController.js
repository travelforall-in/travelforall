// controllers/vendorBookingController.js
const HotelBooking = require('../models/HotelBooking');
const { Hotel } = require('../models/Hotel');
const mongoose = require('mongoose');

// @desc    Get all bookings for vendor's hotels
// @route   GET /api/vendor/bookings
// @access  Private/Vendor
exports.getVendorBookings = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Create a dynamic query object
    const query = { vendor: req.vendor._id };

    // Optional filters
    if (req.query.bookingStatus) query.bookingStatus = req.query.bookingStatus;
    if (req.query.paymentStatus) query['paymentDetails.paymentStatus'] = req.query.paymentStatus;
    if (req.query.hotelId) query.hotel = req.query.hotelId;

    // Date range filtering for check-in
    if (req.query.checkInStart && req.query.checkInEnd) {
      query['stayDetails.checkInDate'] = {
        $gte: new Date(req.query.checkInStart),
        $lte: new Date(req.query.checkInEnd)
      };
    }

    // Guest name search
    if (req.query.guestName) {
      query['contactDetails.primaryGuest.name'] = { 
        $regex: req.query.guestName, 
        $options: 'i' 
      };
    }

    // Booking reference search
    if (req.query.bookingReference) {
      query.bookingReference = { 
        $regex: req.query.bookingReference, 
        $options: 'i' 
      };
    }

    // Sorting
    const sortOptions = {};
    if (req.query.sortBy) {
      const [field, order] = req.query.sortBy.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default sort
    }

    // Execute query
    const bookings = await HotelBooking.find(query)
      .populate('user', 'name email phone')
      .populate('hotel', 'name address category')
      .sort(sortOptions)
      .limit(limit)
      .skip(skipIndex);

    // Count total documents for pagination
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
    console.error('Get Vendor Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single booking details
// @route   GET /api/vendor/bookings/:id
// @access  Private/Vendor
exports.getVendorBooking = async (req, res) => {
  try {
    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    // Find the booking
    const booking = await HotelBooking.findOne({
      _id: req.params.id,
      vendor: req.vendor._id
    })
      .populate('user', 'name email phone')
      .populate('hotel', 'name address category location images contactInfo')
      .populate('hotel.location', 'name country');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or access denied',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get Vendor Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update booking status by vendor
// @route   PUT /api/vendor/bookings/:id/status
// @access  Private/Vendor
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, vendorNotes } = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    // Find the booking
    let booking = await HotelBooking.findOne({
      _id: req.params.id,
      vendor: req.vendor._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or access denied',
      });
    }

    // Validate booking status
    const validBookingStatuses = ['confirmed', 'cancelled', 'checked_in', 'checked_out', 'no_show'];
    if (bookingStatus && !validBookingStatuses.includes(bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status',
      });
    }

    // Business logic for status changes
    if (bookingStatus) {
      // Check if status change is valid
      const currentStatus = booking.bookingStatus;
      
      if (currentStatus === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update status of a cancelled booking',
        });
      }

      if (currentStatus === 'checked_out' && bookingStatus !== 'checked_out') {
        return res.status(400).json({
          success: false,
          message: 'Cannot change status after checkout',
        });
      }

      // Update booking status
      booking.bookingStatus = bookingStatus;

      // Handle cancellation by vendor
      if (bookingStatus === 'cancelled') {
        booking.cancellationDetails = {
          ...booking.cancellationDetails,
          cancelledAt: new Date(),
          cancelledBy: 'vendor',
          cancellationReason: vendorNotes || 'Cancelled by vendor'
        };
        
        // Set refund status based on cancellation timing
        const checkInDate = new Date(booking.stayDetails.checkInDate);
        const now = new Date();
        const timeDiff = checkInDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff >= 2) {
          booking.cancellationDetails.refundStatus = 'processed';
          booking.paymentDetails.paymentStatus = 'refunded';
        } else {
          booking.cancellationDetails.refundStatus = 'pending';
        }
      }

      // Update hotel booking count and revenue
      if (bookingStatus === 'confirmed' && currentStatus !== 'confirmed') {
        await Hotel.findByIdAndUpdate(booking.hotel, {
          $inc: { totalBookings: 1 }
        });
      }

      if (bookingStatus === 'checked_out' && booking.paymentDetails.paymentStatus === 'completed') {
        await Hotel.findByIdAndUpdate(booking.hotel, {
          $inc: { totalRevenue: booking.pricing.totalAmount }
        });
      }
    }

    // Add vendor notes
    if (vendorNotes) {
      booking.vendorNotes = vendorNotes;
    }

    // Save the updated booking
    await booking.save();

    // Populate for detailed response
    await booking.populate('user', 'name email phone');
    await booking.populate('hotel', 'name address category');

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Update Booking Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get booking analytics for vendor
// @route   GET /api/vendor/bookings/analytics
// @access  Private/Vendor
exports.getBookingAnalytics = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    
    // Date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      checkedInBookings,
      totalRevenue,
      monthlyRevenue,
      monthlyBookings,
      lastMonthBookings,
      yearlyBookings,
      averageBookingValue,
      topPerformingHotels
    ] = await Promise.all([
      // Total bookings
      HotelBooking.countDocuments({ vendor: vendorId }),
      
      // Confirmed bookings
      HotelBooking.countDocuments({ vendor: vendorId, bookingStatus: 'confirmed' }),
      
      // Pending bookings
      HotelBooking.countDocuments({ vendor: vendorId, bookingStatus: 'pending' }),
      
      // Cancelled bookings
      HotelBooking.countDocuments({ vendor: vendorId, bookingStatus: 'cancelled' }),
      
      // Checked in bookings
      HotelBooking.countDocuments({ vendor: vendorId, bookingStatus: 'checked_in' }),
      
      // Total revenue (completed payments)
      HotelBooking.aggregate([
        { $match: { vendor: vendorId, 'paymentDetails.paymentStatus': 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      
      // Monthly revenue
      HotelBooking.aggregate([
        { 
          $match: { 
            vendor: vendorId, 
            'paymentDetails.paymentStatus': 'completed',
            createdAt: { $gte: startOfMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      
      // Monthly bookings
      HotelBooking.countDocuments({
        vendor: vendorId,
        createdAt: { $gte: startOfMonth }
      }),
      
      // Last month bookings
      HotelBooking.countDocuments({
        vendor: vendorId,
        createdAt: { 
          $gte: startOfLastMonth,
          $lte: endOfLastMonth
        }
      }),
      
      // Yearly bookings
      HotelBooking.countDocuments({
        vendor: vendorId,
        createdAt: { $gte: startOfYear }
      }),
      
      // Average booking value
      HotelBooking.aggregate([
        { $match: { vendor: vendorId } },
        { $group: { _id: null, average: { $avg: '$pricing.totalAmount' } } }
      ]),
      
      // Top performing hotels
      HotelBooking.aggregate([
        { $match: { vendor: vendorId, bookingStatus: { $in: ['confirmed', 'checked_in', 'checked_out'] } } },
        {
          $group: {
            _id: '$hotel',
            bookingsCount: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.totalAmount' }
          }
        },
        { $sort: { bookingsCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'hotels',
            localField: '_id',
            foreignField: '_id',
            as: 'hotelInfo'
          }
        },
        { $unwind: '$hotelInfo' },
        {
          $project: {
            hotelName: '$hotelInfo.name',
            bookingsCount: 1,
            totalRevenue: 1
          }
        }
      ])
    ]);

    // Calculate growth rates
    const bookingGrowth = lastMonthBookings > 0 
      ? ((monthlyBookings - lastMonthBookings) / lastMonthBookings * 100).toFixed(1)
      : monthlyBookings > 0 ? 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalBookings,
          confirmedBookings,
          pendingBookings,
          cancelledBookings,
          checkedInBookings,
          totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
          monthlyRevenue: monthlyRevenue[0] ? monthlyRevenue[0].total : 0,
          averageBookingValue: averageBookingValue[0] ? Math.round(averageBookingValue[0].average) : 0
        },
        trends: {
          monthlyBookings,
          lastMonthBookings,
          yearlyBookings,
          bookingGrowth: parseFloat(bookingGrowth)
        },
        topHotels: topPerformingHotels
      }
    });
  } catch (error) {
    console.error('Get Booking Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get bookings by date range for vendor
// @route   GET /api/vendor/bookings/by-date
// @access  Private/Vendor
exports.getBookingsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date'
      });
    }

    // Build aggregation pipeline
    let dateFormat;
    switch (groupBy) {
      case 'month':
        dateFormat = '%Y-%m';
        break;
      case 'week':
        dateFormat = '%Y-%U';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const bookingsByDate = await HotelBooking.aggregate([
      {
        $match: {
          vendor: req.vendor._id,
          createdAt: {
            $gte: start,
            $lte: end
          }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: dateFormat, date: '$createdAt' } },
            status: '$bookingStatus'
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          bookings: {
            $push: {
              status: '$_id.status',
              count: '$count',
              revenue: '$revenue'
            }
          },
          totalBookings: { $sum: '$count' },
          totalRevenue: { $sum: '$revenue' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: bookingsByDate
    });
  } catch (error) {
    console.error('Get Bookings by Date Range Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Export bookings data for vendor
// @route   GET /api/vendor/bookings/export
// @access  Private/Vendor
exports.exportBookings = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate, status } = req.query;

    // Build query
    const query = { vendor: req.vendor._id };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (status) {
      query.bookingStatus = status;
    }

    // Get bookings
    const bookings = await HotelBooking.find(query)
      .populate('user', 'name email phone')
      .populate('hotel', 'name address category')
      .sort('-createdAt')
      .lean();

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = bookings.map(booking => ({
        'Booking Reference': booking.bookingReference,
        'Hotel Name': booking.hotel.name,
        'Guest Name': booking.contactDetails.primaryGuest.name,
        'Guest Email': booking.contactDetails.primaryGuest.email,
        'Check-in Date': booking.stayDetails.checkInDate.toISOString().split('T')[0],
        'Check-out Date': booking.stayDetails.checkOutDate.toISOString().split('T')[0],
        'Nights': booking.stayDetails.numberOfNights,
        'Rooms': booking.roomDetails.numberOfRooms,
        'Adults': booking.guestDetails.adults,
        'Children': booking.guestDetails.children,
        'Total Amount': booking.pricing.totalAmount,
        'Payment Status': booking.paymentDetails.paymentStatus,
        'Booking Status': booking.bookingStatus,
        'Created Date': booking.createdAt.toISOString().split('T')[0]
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
      
      // Simple CSV conversion
      if (csvData.length > 0) {
        const headers = Object.keys(csvData[0]).join(',');
        const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
        res.send(headers + '\n' + rows);
      } else {
        res.send('No data available');
      }
    } else {
      // Return JSON format
      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    }
  } catch (error) {
    console.error('Export Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};