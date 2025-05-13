// controllers/hotelController.js
const Hotel = require('../models/Hotel');
const { HotelReview } = require('../models/Hotel');
const Location = require('../models/Location');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private/Admin
exports.createHotel = async (req, res) => {
  try {
    // Handle image uploads
    const imageFiles = req.files;
    
    // Prepare hotel data
    const hotelData = { ...req.body };

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

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res) => {
  try {
    const query = {};
    
    // Filter by location if provided
    if (req.query.location) {
      if (!mongoose.Types.ObjectId.isValid(req.query.location)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid location ID'
        });
      }
      query.location = req.query.location;
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by minimum rating
    if (req.query.minRating) {
      query.rating = { $gte: parseFloat(req.query.minRating) };
    }
    
    // Filter by price range
    if (req.query.minPrice) {
      query['priceRange.min'] = { $gte: parseFloat(req.query.minPrice) };
    }
    
    if (req.query.maxPrice) {
      query['priceRange.max'] = { $lte: parseFloat(req.query.maxPrice) };
    }
    
    // Filter by name
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }
    
    // Filter by amenities (comma separated)
    if (req.query.amenities) {
      const amenitiesList = req.query.amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }
    
    // Filter by featured
    if (req.query.featured) {
      query.featured = req.query.featured === 'true';
    }
    
    // Sorting
    const sortOptions = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.rating = -1; // Default: highest rated first
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
    console.error('Get Hotels Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotel = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID'
      });
    }
    
    const hotel = await Hotel.findById(req.params.id)
      .populate('location', 'name country region description images')
      .populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 }, limit: 10 },
        populate: { path: 'user', select: 'name' }
      });
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error('Get Hotel Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
exports.updateHotel = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID'
      });
    }
    
    let hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle image uploads
    const imageFiles = req.files;
    
    // Add new image paths if images were uploaded
    if (imageFiles && imageFiles.length > 0) {
      // Remove old image files if they exist
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

    // Parse JSON-like string fields
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

    // Convert numeric fields
    if (updateData.rating) updateData.rating = parseFloat(updateData.rating);
    
    // Convert boolean field
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true';
    }
    
    // If location is being updated, validate it exists
    if (updateData.location && mongoose.Types.ObjectId.isValid(updateData.location)) {
      const locationExists = await Location.findById(updateData.location);
      if (!locationExists) {
        return res.status(404).json({
          success: false,
          message: 'Location not found'
        });
      }
    }
    
    // Update hotel
    hotel = await Hotel.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    ).populate('location', 'name country');
    
    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error('Update Hotel Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
exports.deleteHotel = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID'
      });
    }
    
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
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
    console.error('Delete Hotel Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add review to hotel
// @route   POST /api/hotels/:id/reviews
// @access  Private
exports.addHotelReview = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID'
      });
    }
    
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }
    
    // Check if user already reviewed this hotel
    const existingReview = await HotelReview.findOne({
      hotel: req.params.id,
      user: req.user._id
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You already reviewed this hotel',
      });
    }
    
    // Create new review
    const review = await HotelReview.create({
      hotel: req.params.id,
      user: req.user._id,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment
    });
    
    // Update hotel average rating
    const allReviews = await HotelReview.find({ hotel: req.params.id });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / allReviews.length;
    
    await Hotel.findByIdAndUpdate(req.params.id, { rating: avgRating });
    
    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Add Hotel Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search hotels
// @route   GET /api/hotels/search
// @access  Public
exports.searchHotels = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Search keyword is required'
      });
    }
    
    // Create query for keyword search
    const query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    // Execute query
    const hotels = await Hotel.find(query)
      .populate('location', 'name country')
      .limit(20);
    
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Search Hotels Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get featured hotels
// @route   GET /api/hotels/featured
// @access  Public
exports.getFeaturedHotels = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    
    const featuredHotels = await Hotel.find({ featured: true })
      .populate('location', 'name country')
      .sort('-rating')
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: featuredHotels.length,
      data: featuredHotels
    });
  } catch (error) {
    console.error('Get Featured Hotels Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};