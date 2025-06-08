// controllers/vendorHotelController.js
const { Hotel, HotelReview } = require('../models/Hotel');
const Location = require('../models/Location');
const HotelBooking = require('../models/HotelBooking');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// @desc    Create new hotel by vendor
// @route   POST /api/vendor/hotels
// @access  Private/Vendor
exports.createHotel = async (req, res) => {
  try {
    // Handle image uploads
    const imageFiles = req.files;
    
    // Prepare hotel data
    const hotelData = { ...req.body };
    
    // Add vendor ID
    hotelData.vendor = req.vendor._id;

    // Add image paths if images were uploaded
    if (imageFiles && imageFiles.length > 0) {
      hotelData.images = imageFiles.map(file => `/uploads/hotels/${file.filename}`);
    }

    // Parse JSON-like string fields
    const fieldsToParseAsJSON = ['amenities', 'roomTypes', 'contactInfo', 'policies', 'priceRange'];

    fieldsToParseAsJSON.forEach(field => {
      if (hotelData[field] && typeof hotelData[field] === 'string') {
        try {
          hotelData[field] = JSON.parse(hotelData[field]);
        } catch (error) {
          console.warn(`Could not parse ${field}:`, hotelData[field]);
        }
      }
    });

    // Convert numeric fields
    if (hotelData.rating) hotelData.rating = parseFloat(hotelData.rating);
    
    // Convert boolean field
    hotelData.featured = hotelData.featured === 'true';

    // Set status to pending approval
    hotelData.status = 'pending_approval';

    // Validate location exists
    if (!mongoose.Types.ObjectId.isValid(hotelData.location)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID'
      });
    }
    
    const locationExists = await Location.findById(hotelData.location);
    if (!locationExists) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Create hotel
    const newHotel = await Hotel.create(hotelData);
    
    res.status(201).json({
      success: true,
      message: 'Hotel created successfully. Awaiting admin approval.',
      data: newHotel,
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    
    // Clean up uploaded files if hotel creation fails
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads/hotels', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all hotels belonging to vendor
// @route   GET /api/vendor/hotels
// @access  Private/Vendor
exports.getVendorHotels = async (req, res) => {
  try {
    const query = { vendor: req.vendor._id };
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by name
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }
    
    // Sorting
    const sortOptions = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default sort
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .populate('location', 'name country')
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limit);
    
    // Pagination result
    const pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
    
    res.status(200).json({
      success: true,
      count: hotels.length,
      pagination,
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

// @desc    Get single hotel by vendor
// @route   GET /api/vendor/hotels/:id
// @access  Private/Vendor
exports.getVendorHotel = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID'
      });
    }
    
    const hotel = await Hotel.findOne({
      _id: req.params.id,
      vendor: req.vendor._id
    })
      .populate('location', 'name country region description')
      .populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 }, limit: 10 },
        populate: { path: 'user', select: 'name' }
      });
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found or access denied',
      });
    }
    
    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error('Get Vendor Hotel Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update hotel by vendor
// @route   PUT /api/vendor/hotels/:id
// @access  Private/Vendor
exports.updateVendorHotel = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID'
      });
    }
    
    let hotel = await Hotel.findOne({
      _id: req.params.id,
      vendor: req.vendor._id
    });
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found or access denied',
      });
    }

    // Check if hotel is approved - only allow certain updates if approved
    if (hotel.status === 'active') {
      // For active hotels, only allow specific fields to be updated
      const allowedFields = ['description', 'priceRange', 'roomTypes', 'amenities', 'contactInfo', 'policies'];
      const updateData = {};
      
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      // Handle image uploads for active hotels
      const imageFiles = req.files;
      if (imageFiles && imageFiles.length > 0) {
        updateData.images = imageFiles.map(file => `/uploads/hotels/${file.filename}`);
      }

      // Parse JSON fields
      const fieldsToParseAsJSON = ['amenities', 'roomTypes', 'contactInfo', 'policies', 'priceRange'];
      fieldsToParseAsJSON.forEach(field => {
        if (updateData[field] && typeof updateData[field] === 'string') {
          try {
            updateData[field] = JSON.parse(updateData[field]);
          } catch (error) {
            console.warn(`Could not parse ${field}:`, updateData[field]);
          }
        }
      });

      hotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('location', 'name country');

    } else {
      // For pending/inactive hotels, allow full update
      const updateData = { ...req.body };

      // Handle image uploads
      const imageFiles = req.files;
      if (imageFiles && imageFiles.length > 0) {
        // Remove old images
        if (hotel.images && hotel.images.length > 0) {
          hotel.images.forEach(imagePath => {
            const fullPath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          });
        }
        updateData.images = imageFiles.map(file => `/uploads/hotels/${file.filename}`);
      }

      // Parse JSON fields
      const fieldsToParseAsJSON = ['amenities', 'roomTypes', 'contactInfo', 'policies', 'priceRange'];
      fieldsToParseAsJSON.forEach(field => {
        if (updateData[field] && typeof updateData[field] === 'string') {
          try {
            updateData[field] = JSON.parse(updateData[field]);
          } catch (error) {
            console.warn(`Could not parse ${field}:`, updateData[field]);
          }
        }
      });

      // Convert fields
      if (updateData.rating) updateData.rating = parseFloat(updateData.rating);
      if (updateData.featured !== undefined) updateData.featured = updateData.featured === 'true';

      // Don't allow vendor to change status or approval fields
      delete updateData.status;
      delete updateData.approvedBy;
      delete updateData.approvedAt;
      delete updateData.vendor;

      hotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('location', 'name country');
    }
    
    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error('Update Vendor Hotel Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete hotel by vendor
// @route   DELETE /api/vendor/hotels/:id
// @access  Private/Vendor
exports.deleteVendorHotel = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID'
      });
    }
    
    const hotel = await Hotel.findOne({
      _id: req.params.id,
      vendor: req.vendor._id
    });
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found or access denied',
      });
    }

    // Check if hotel has active bookings
    const activeBookings = await HotelBooking.countDocuments({
      hotel: req.params.id,
      bookingStatus: { $in: ['confirmed', 'checked_in'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete hotel with ${activeBookings} active bookings`
      });
    }
    
    // Remove image files
    if (hotel.images && hotel.images.length > 0) {
      hotel.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    
    // Remove hotel and its reviews
    await HotelReview.deleteMany({ hotel: req.params.id });
    await Hotel.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully',
    });
  } catch (error) {
    console.error('Delete Vendor Hotel Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get hotel analytics for vendor
// @route   GET /api/vendor/hotels/:id/analytics
// @access  Private/Vendor
exports.getHotelAnalytics = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID'
      });
    }

    const hotel = await Hotel.findOne({
      _id: req.params.id,
      vendor: req.vendor._id
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found or access denied'
      });
    }

    // Get booking analytics
    const [
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
      currentMonthBookings,
      lastMonthBookings,
      averageRating
    ] = await Promise.all([
      HotelBooking.countDocuments({ hotel: req.params.id }),
      HotelBooking.countDocuments({ hotel: req.params.id, bookingStatus: 'confirmed' }),
      HotelBooking.countDocuments({ hotel: req.params.id, bookingStatus: 'cancelled' }),
      HotelBooking.aggregate([
        { $match: { hotel: mongoose.Types.ObjectId(req.params.id), 'paymentDetails.paymentStatus': 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      HotelBooking.countDocuments({
        hotel: req.params.id,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
      }),
      HotelBooking.countDocuments({
        hotel: req.params.id,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      HotelReview.aggregate([
        { $match: { hotel: mongoose.Types.ObjectId(req.params.id) } },
        { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
      ])
    ]);

    const revenue = totalRevenue[0] ? totalRevenue[0].total : 0;
    const rating = averageRating[0] ? {
      average: Math.round(averageRating[0].average * 10) / 10,
      count: averageRating[0].count
    } : { average: 0, count: 0 };

    res.status(200).json({
      success: true,
      data: {
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          currentMonth: currentMonthBookings,
          lastMonth: lastMonthBookings,
          growth: lastMonthBookings > 0 ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings * 100).toFixed(1) : 0
        },
        revenue: {
          total: revenue,
          currency: 'USD'
        },
        rating: rating
      }
    });

  } catch (error) {
    console.error('Get Hotel Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};