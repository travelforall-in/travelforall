// controllers/locationController.js
const Location = require('../models/Location');
const Hotel = require('../models/Hotel');
const Transportation = require('../models/Transportation');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// @desc    Create new location
// @route   POST /api/locations
// @access  Private/Admin
exports.createLocation = async (req, res) => {
  try {
    // Handle image uploads
    const imageFiles = req.files;
    
    // Prepare location data
    const locationData = { ...req.body };

    // Add image paths if images were uploaded
    if (imageFiles && imageFiles.length > 0) {
      locationData.images = imageFiles.map(file => `/uploads/locations/${file.filename}`);
    }

    // Parse JSON-like string fields
    const fieldsToParseAsJSON = ['attractions', 'travelTips', 'weather'];

    fieldsToParseAsJSON.forEach(field => {
      if (locationData[field] && typeof locationData[field] === 'string') {
        try {
          locationData[field] = JSON.parse(locationData[field]);
        } catch (error) {
          console.warn(`Could not parse ${field}:`, locationData[field]);
        }
      }
    });

    // Convert boolean field
    locationData.featured = locationData.featured === 'true';

    // Create location
    const newLocation = await Location.create(locationData);
    
    res.status(201).json({
      success: true,
      data: newLocation,
    });
  } catch (error) {
    console.error('Error creating location:', error);
    
    // Clean up uploaded files if location creation fails
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads/locations', file.filename);
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

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
exports.getLocations = async (req, res) => {
  try {
    const query = {};
    
    // Filter by country if provided
    if (req.query.country) {
      query.country = { $regex: req.query.country, $options: 'i' };
    }
    
    // Filter by region if provided
    if (req.query.region) {
      query.region = { $regex: req.query.region, $options: 'i' };
    }
    
    // Filter by name
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }
    
    // Filter by featured
    if (req.query.featured) {
      query.featured = req.query.featured === 'true';
    }
    
    // Sorting
    const sortOptions = req.query.sort 
      ? req.query.sort.split(',').join(' ')
      : '-popularityIndex';
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const total = await Location.countDocuments(query);
    const locations = await Location.find(query)
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
      count: locations.length,
      pagination,
      data: locations,
    });
  } catch (error) {
    console.error('Get Locations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Public
exports.getLocation = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID'
      });
    }
    
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error('Get Location Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private/Admin
exports.updateLocation = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID'
      });
    }
    
    let location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle image uploads
    const imageFiles = req.files;
    
    // Add new image paths if images were uploaded
    if (imageFiles && imageFiles.length > 0) {
      // Remove old image files if they exist
      if (location.images && location.images.length > 0) {
        location.images.forEach(imagePath => {
          const fullPath = path.join(__dirname, '../', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }

      updateData.images = imageFiles.map(file => `/uploads/locations/${file.filename}`);
    }

    // Parse JSON-like string fields
    const fieldsToParseAsJSON = ['attractions', 'travelTips', 'weather'];

    fieldsToParseAsJSON.forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (error) {
          console.warn(`Could not parse ${field}:`, updateData[field]);
        }
      }
    });

    // Convert boolean field
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true';
    }
    
    // Update location
    location = await Location.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    );
    
    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error('Update Location Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private/Admin
exports.deleteLocation = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID'
      });
    }
    
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }
    
    // Check for associated hotels
    const hotels = await Hotel.countDocuments({ location: req.params.id });
    
    if (hotels > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete location with ${hotels} associated hotels`
      });
    }
    
    // Check for associated transportation
    const transportation = await Transportation.countDocuments({ destinations: req.params.id });
    
    if (transportation > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete location with ${transportation} associated transportation options`
      });
    }
    
    // Remove image files
    if (location.images && location.images.length > 0) {
      location.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    
    await Location.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Location deleted successfully',
    });
  } catch (error) {
    console.error('Delete Location Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get hotels in a location
// @route   GET /api/locations/:id/hotels
// @access  Public
exports.getLocationHotels = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID'
      });
    }
    
    // Verify location exists
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }
    
    // Create query
    const query = { location: req.params.id };
    
    // Filter by category if provided
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
    
    // Filter by amenities (comma separated)
    if (req.query.amenities) {
      const amenitiesList = req.query.amenities.split(',');
      query.amenities = { $all: amenitiesList };
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
    console.error('Get Location Hotels Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get transportation options for a location
// @route   GET /api/locations/:id/transportation
// @access  Public
exports.getLocationTransportation = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID'
      });
    }
    
    // Verify location exists
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }
    
    // Create query for transportation
    const query = { destinations: req.params.id };
    
    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by operator
    if (req.query.operator) {
      query.operator = { $regex: req.query.operator, $options: 'i' };
    }
    
    // Sorting
    const sortOptions = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const total = await Transportation.countDocuments(query);
    const transportation = await Transportation.find(query)
      .populate('destinations', 'name country')
      .populate('routes.from routes.to', 'name country')
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
      count: transportation.length,
      pagination,
      data: transportation,
    });
  } catch (error) {
    console.error('Get Location Transportation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search locations
// @route   GET /api/locations/search
// @access  Public
exports.searchLocations = async (req, res) => {
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
        { country: { $regex: keyword, $options: 'i' } },
        { region: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    // Execute query
    const locations = await Location.find(query).limit(20);
    
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('Search Locations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get featured locations
// @route   GET /api/locations/featured
// @access  Public
exports.getFeaturedLocations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    
    const featuredLocations = await Location.find({ featured: true })
      .sort('-popularityIndex')
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: featuredLocations.length,
      data: featuredLocations
    });
  } catch (error) {
    console.error('Get Featured Locations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};