//adminController.js
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const User = require('../models/User');
const CustomPackage = require('../models/CustomPackage');
const mongoose = require('mongoose');



// @desc    Get all packages with advanced filtering
// @route   GET /api/admin/packages
// @access  Private/Admin
exports.getPackages = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Create a dynamic query object
    const query = {};

    // Optional filters
    if (req.query.type) query.type = req.query.type;
    if (req.query.minPrice) query.price = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) query.price = { 
      ...query.price, 
      $lte: parseFloat(req.query.maxPrice) 
    };
    if (req.query.destination) {
      query.destination = { 
        $regex: req.query.destination, 
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
    const packages = await Package.find(query)
      .select('-reviews') // Exclude detailed reviews
      .sort(sortOptions)
      .limit(limit)
      .skip(skipIndex);

    // Count total documents for pagination
    const total = await Package.countDocuments(query);

    res.status(200).json({
      success: true,
      count: packages.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: packages,
    });
  } catch (error) {
    console.error('Get Packages Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all bookings with advanced filtering
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getBookings = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Create a dynamic query object
    const query = {};

    // Optional filters
    if (req.query.bookingStatus) query.bookingStatus = req.query.bookingStatus;
    if (req.query.paymentStatus) query.paymentStatus = req.query.paymentStatus;
    if (req.query.minPrice) query.totalPrice = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) query.totalPrice = { 
      ...query.totalPrice, 
      $lte: parseFloat(req.query.maxPrice) 
    };

    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      query.travelDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
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
    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('package', 'name type destination')
      .sort(sortOptions)
      .limit(limit)
      .skip(skipIndex);

    // Count total documents for pagination
    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: bookings,
    });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    // Find the booking
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Validate and update booking status
    const validBookingStatuses = ['confirmed', 'pending', 'cancelled'];
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
    const validPaymentStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment status',
        });
      }
      booking.paymentStatus = paymentStatus;
    }

    // Save the updated booking
    await booking.save();

    // Populate for detailed response
    await booking.populate('user', 'name email');
    await booking.populate('package', 'name type destination');

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

// @desc    Get all users with advanced filtering
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Create a dynamic query object
    const query = {};

    // Optional filters
    if (req.query.role) query.role = req.query.role;
    if (req.query.name) {
      query.name = { 
        $regex: req.query.name, 
        $options: 'i' 
      };
    }
    if (req.query.email) {
      query.email = { 
        $regex: req.query.email, 
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
    const users = await User.find(query)
      .select('-password') // Exclude password
      .sort(sortOptions)
      .limit(limit)
      .skip(skipIndex);

    // Count total documents for pagination
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get comprehensive dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPackages,
      totalBookings,
      pendingBookings,
      cancelledBookings,
      revenueResult,
      packageStats,
      bookingStatusBreakdown,
      recentBookings,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      Package.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'pending' }),
      Booking.countDocuments({ bookingStatus: 'cancelled' }),
      Booking.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { 
          $group: { 
            _id: null, 
            total: { $sum: '$totalPrice' },
            count: { $sum: 1 }
          } 
        }
      ]),
      Package.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            averagePrice: { $avg: '$price' }
          }
        }
      ]),
      Booking.aggregate([
        {
          $group: {
            _id: '$bookingStatus',
            count: { $sum: 1 }
          }
        }
      ]),
      Booking.find()
        .sort('-createdAt')
        .limit(5)
        .populate('user', 'name email')
        .populate('package', 'name type'),
      User.find()
        .sort('-createdAt')
        .limit(5)
        .select('name email createdAt')
    ]);

    // Safely process results
    const revenue = revenueResult[0] ? revenueResult[0].total : 0;
    const completedBookingsCount = revenueResult[0] ? revenueResult[0].count : 0;

    // Transform package stats
    const packageStatsFormatted = packageStats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        averagePrice: stat.averagePrice
      };
      return acc;
    }, {});

    // Transform booking status breakdown
    const bookingStatusBreakdownFormatted = bookingStatusBreakdown.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalPackages,
          totalBookings,
          pendingBookings,
          cancelledBookings,
          completedBookingsCount,
          revenue
        },
        packageStats: packageStatsFormatted,
        bookingStatusBreakdown: bookingStatusBreakdownFormatted,
        recentBookings,
        recentUsers
      },
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    // Find and delete the user
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Optionally, delete associated bookings
    await Booking.deleteMany({ user: req.params.id });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all custom packages with filtering
// @route   GET /api/admin/custom-packages
// @access  Private/Admin
exports.getCustomPackages = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Create a dynamic query object
    const query = {};

    // Optional filters
    if (req.query.status) query.status = req.query.status;
    if (req.query.destination) {
      query.destination = { 
        $regex: req.query.destination, 
        $options: 'i' 
      };
    }
    if (req.query.minBudget) query.budget = { $gte: parseFloat(req.query.minBudget) };
    if (req.query.maxBudget) query.budget = { 
      ...query.budget, 
      $lte: parseFloat(req.query.maxBudget) 
    };

    // Date range filtering
    if (req.query.startDate) {
      query.startDate = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      query.endDate = { $lte: new Date(req.query.endDate) };
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
    const customPackages = await CustomPackage.find(query)
      .populate('user', 'name email phone')
      .sort(sortOptions)
      .limit(limit)
      .skip(skipIndex);

    // Count total documents for pagination
    const total = await CustomPackage.countDocuments(query);

    res.status(200).json({
      success: true,
      count: customPackages.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: customPackages,
    });
  } catch (error) {
    console.error('Get Custom Packages Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update custom package status and quote
// @route   PUT /api/admin/custom-packages/:id
// @access  Private/Admin
exports.updateCustomPackageStatus = async (req, res) => {
  try {
    const { status, quote } = req.body;

    // Validate package ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid custom package ID',
      });
    }

    // Find the custom package
    let customPackage = await CustomPackage.findById(req.params.id);

    if (!customPackage) {
      return res.status(404).json({
        success: false,
        message: 'Custom package not found',
      });
    }

    // Validate and update status
    const validStatuses = ['pending', 'processing', 'quoted', 'confirmed', 'cancelled'];
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status',
        });
      }
      customPackage.status = status;
    }

    // Update quote if provided
    if (quote) {
      customPackage.quote = {
        ...customPackage.quote,
        ...quote,
        expiresAt: quote.expiresAt ? new Date(quote.expiresAt) : undefined
      };
    }

    // Save the updated custom package
    await customPackage.save();

    // Populate user details for the response
    await customPackage.populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      data: customPackage,
    });
  } catch (error) {
    console.error('Update Custom Package Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create itinerary for custom package
// @route   POST /api/admin/custom-packages/:id/itinerary
// @access  Private/Admin
exports.createCustomPackageItinerary = async (req, res) => {
  try {
    const { itinerary } = req.body;

    // Validate package ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid custom package ID',
      });
    }

    // Find the custom package
    let customPackage = await CustomPackage.findById(req.params.id);

    if (!customPackage) {
      return res.status(404).json({
        success: false,
        message: 'Custom package not found',
      });
    }

    // Validate itinerary
    if (!itinerary || !Array.isArray(itinerary)) {
      return res.status(400).json({
        success: false,
        message: 'Valid itinerary array is required',
      });
    }

    // Add detailed itinerary to the quote
    if (!customPackage.quote) {
      customPackage.quote = {};
    }
    
    customPackage.quote.details = {
      ...customPackage.quote.details,
      itinerary
    };

    // Save the updated custom package
    await customPackage.save();

    res.status(200).json({
      success: true,
      data: customPackage,
    });
  } catch (error) {
    console.error('Create Custom Package Itinerary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete custom package
// @route   DELETE /api/admin/custom-packages/:id
// @access  Private/Admin
exports.deleteCustomPackage = async (req, res) => {
  try {
    // Validate package ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid custom package ID',
      });
    }

    // Find and delete the custom package
    const customPackage = await CustomPackage.findByIdAndDelete(req.params.id);

    if (!customPackage) {
      return res.status(404).json({
        success: false,
        message: 'Custom package not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Custom package deleted successfully',
    });
  } catch (error) {
    console.error('Delete Custom Package Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};