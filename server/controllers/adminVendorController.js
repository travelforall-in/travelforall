// controllers/adminVendorController.js
const VendorAdmin = require('../models/VendorAdmin');
const { Hotel } = require('../models/Hotel');
const HotelBooking = require('../models/HotelBooking');
const mongoose = require('mongoose');

// @desc    Get all vendors with filtering
// @route   GET /api/admin/vendors
// @access  Private/Admin
exports.getAllVendors = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Create a dynamic query object
    const query = {};

    // Optional filters
    if (req.query.status) query.status = req.query.status;
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
    if (req.query.companyName) {
      query['vendorDetails.companyName'] = { 
        $regex: req.query.companyName, 
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
    const vendors = await VendorAdmin.find(query)
      .select('-password') // Exclude password
      .sort(sortOptions)
      .limit(limit)
      .skip(skipIndex);

    // Count total documents for pagination
    const total = await VendorAdmin.countDocuments(query);

    // Get additional stats for each vendor
    const vendorsWithStats = await Promise.all(
      vendors.map(async (vendor) => {
        const [hotelCount, bookingCount, totalRevenue] = await Promise.all([
          Hotel.countDocuments({ vendor: vendor._id }),
          HotelBooking.countDocuments({ vendor: vendor._id }),
          HotelBooking.aggregate([
            { 
              $match: { 
                vendor: vendor._id,
                'paymentDetails.paymentStatus': 'completed'
              } 
            },
            { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
          ])
        ]);

        return {
          ...vendor.toObject(),
          stats: {
            totalHotels: hotelCount,
            totalBookings: bookingCount,
            totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: vendors.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: vendorsWithStats,
    });
  } catch (error) {
    console.error('Get All Vendors Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single vendor details
// @route   GET /api/admin/vendors/:id
// @access  Private/Admin
exports.getVendor = async (req, res) => {
  try {
    // Validate vendor ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID',
      });
    }

    // Find vendor
    const vendor = await VendorAdmin.findById(req.params.id).select('-password');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    // Get vendor statistics
    const [
      hotelStats,
      bookingStats,
      revenueStats,
      recentHotels,
      recentBookings
    ] = await Promise.all([
      // Hotel statistics
      Hotel.aggregate([
        { $match: { vendor: vendor._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Booking statistics
      HotelBooking.aggregate([
        { $match: { vendor: vendor._id } },
        {
          $group: {
            _id: '$bookingStatus',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Revenue statistics
      HotelBooking.aggregate([
        { $match: { vendor: vendor._id, 'paymentDetails.paymentStatus': 'completed' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$pricing.totalAmount' },
            averageBookingValue: { $avg: '$pricing.totalAmount' },
            totalBookings: { $sum: 1 }
          }
        }
      ]),
      
      // Recent hotels
      Hotel.find({ vendor: vendor._id })
        .populate('location', 'name country')
        .sort('-createdAt')
        .limit(5)
        .select('name status category createdAt'),
      
      // Recent bookings
      HotelBooking.find({ vendor: vendor._id })
        .populate('hotel', 'name')
        .populate('user', 'name email')
        .sort('-createdAt')
        .limit(10)
        .select('bookingReference bookingStatus pricing.totalAmount createdAt')
    ]);

    // Format statistics
    const hotelStatsFormatted = hotelStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const bookingStatsFormatted = bookingStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const revenue = revenueStats[0] || { totalRevenue: 0, averageBookingValue: 0, totalBookings: 0 };

    res.status(200).json({
      success: true,
      data: {
        vendor,
        statistics: {
          hotels: hotelStatsFormatted,
          bookings: bookingStatsFormatted,
          revenue: revenue
        },
        recentActivity: {
          hotels: recentHotels,
          bookings: recentBookings
        }
      }
    });
  } catch (error) {
    console.error('Get Vendor Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Approve/Reject vendor registration
// @route   PUT /api/admin/vendors/:id/status
// @access  Private/Admin
exports.updateVendorStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    // Validate vendor ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID',
      });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, inactive, pending, suspended',
      });
    }

    // Find vendor
    const vendor = await VendorAdmin.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    // Update vendor status
    vendor.status = status;

    if (status === 'active' && vendor.status !== 'active') {
      vendor.approvedBy = req.user._id; // Admin ID
      vendor.approvedAt = new Date();
    }

    await vendor.save();

    // If vendor is being suspended/deactivated, update their hotels
    if (status === 'suspended' || status === 'inactive') {
      await Hotel.updateMany(
        { vendor: vendor._id },
        { status: 'inactive' }
      );
    }

    // If vendor is being activated, you might want to activate their approved hotels
    if (status === 'active') {
      await Hotel.updateMany(
        { vendor: vendor._id, status: 'pending_approval' },
        { status: 'active', approvedBy: req.user._id, approvedAt: new Date() }
      );
    }

    res.status(200).json({
      success: true,
      message: `Vendor status updated to ${status}`,
      data: vendor
    });
  } catch (error) {
    console.error('Update Vendor Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete vendor
// @route   DELETE /api/admin/vendors/:id
// @access  Private/Admin
exports.deleteVendor = async (req, res) => {
  try {
    // Validate vendor ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID',
      });
    }

    // Find vendor
    const vendor = await VendorAdmin.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    // Check if vendor has active bookings
    const activeBookings = await HotelBooking.countDocuments({
      vendor: req.params.id,
      bookingStatus: { $in: ['confirmed', 'checked_in'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete vendor with ${activeBookings} active bookings. Please handle bookings first.`
      });
    }

    // Delete vendor's hotels and related data
    const vendorHotels = await Hotel.find({ vendor: req.params.id });
    
    for (const hotel of vendorHotels) {
      // Delete hotel bookings
      await HotelBooking.deleteMany({ hotel: hotel._id });
      
      // Remove hotel images (you might want to implement this)
      // deleteHotelImages(hotel.images);
    }

    // Delete hotels
    await Hotel.deleteMany({ vendor: req.params.id });

    // Delete vendor
    await VendorAdmin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Vendor and all associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete Vendor Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get vendor hotels for admin
// @route   GET /api/admin/vendors/:id/hotels
// @access  Private/Admin
exports.getVendorHotels = async (req, res) => {
  try {
    // Validate vendor ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID',
      });
    }

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Create query
    const query = { vendor: req.params.id };

    // Optional filters
    if (req.query.status) query.status = req.query.status;
    if (req.query.category) query.category = req.query.category;

    // Execute query
    const hotels = await Hotel.find(query)
      .populate('location', 'name country')
      .populate('vendor', 'name vendorDetails.companyName')
      .sort('-createdAt')
      .limit(limit)
      .skip(skipIndex);

    // Count total documents
    const total = await Hotel.countDocuments(query);

    res.status(200).json({
      success: true,
      count: hotels.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: hotels,
    });
  } catch (error) {
    console.error('Get Vendor Hotels Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get vendor bookings for admin
// @route   GET /api/admin/vendors/:id/bookings
// @access  Private/Admin
exports.getVendorBookings = async (req, res) => {
  try {
    // Validate vendor ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID',
      });
    }

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Create query
    const query = { vendor: req.params.id };

    // Optional filters
    if (req.query.bookingStatus) query.bookingStatus = req.query.bookingStatus;
    if (req.query.paymentStatus) query['paymentDetails.paymentStatus'] = req.query.paymentStatus;

    // Execute query
    const bookings = await HotelBooking.find(query)
      .populate('user', 'name email')
      .populate('hotel', 'name category')
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
    console.error('Get Vendor Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Approve/Reject vendor hotel
// @route   PUT /api/admin/vendors/hotels/:hotelId/status
// @access  Private/Admin
exports.updateVendorHotelStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    // Validate hotel ID
    if (!mongoose.Types.ObjectId.isValid(req.params.hotelId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID',
      });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending_approval', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    // Find hotel
    const hotel = await Hotel.findById(req.params.hotelId)
      .populate('vendor', 'name email');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    // Update hotel status
    hotel.status = status;

    if (status === 'active') {
      hotel.approvedBy = req.user._id;
      hotel.approvedAt = new Date();
    }

    await hotel.save();

    res.status(200).json({
      success: true,
      message: `Hotel status updated to ${status}`,
      data: hotel
    });
  } catch (error) {
    console.error('Update Vendor Hotel Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get vendor dashboard stats for admin
// @route   GET /api/admin/vendors/dashboard-stats
// @access  Private/Admin
exports.getVendorDashboardStats = async (req, res) => {
  try {
    const [
      totalVendors,
      activeVendors,
      pendingVendors,
      suspendedVendors,
      totalVendorHotels,
      totalVendorBookings,
      totalVendorRevenue,
      recentVendorRegistrations
    ] = await Promise.all([
      VendorAdmin.countDocuments(),
      VendorAdmin.countDocuments({ status: 'active' }),
      VendorAdmin.countDocuments({ status: 'pending' }),
      VendorAdmin.countDocuments({ status: 'suspended' }),
      Hotel.countDocuments(),
      HotelBooking.countDocuments(),
      HotelBooking.aggregate([
        { $match: { 'paymentDetails.paymentStatus': 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      VendorAdmin.find()
        .sort('-createdAt')
        .limit(5)
        .select('name email vendorDetails.companyName status createdAt')
    ]);

    const revenue = totalVendorRevenue[0] ? totalVendorRevenue[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalVendors,
          activeVendors,
          pendingVendors,
          suspendedVendors,
          totalVendorHotels,
          totalVendorBookings,
          totalVendorRevenue: revenue
        },
        recentVendorRegistrations
      }
    });
  } catch (error) {
    console.error('Get Vendor Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};