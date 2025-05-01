// controllers/transportationController.js
const Transportation = require('../models/Transportation');
const { TransportationReview } = require('../models/Transportation');
const Location = require('../models/Location');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// @desc    Create new transportation
// @route   POST /api/transportation
// @access  Private/Admin
exports.createTransportation = async (req, res) => {
  try {
    // Handle image uploads
    const imageFiles = req.files;
    
    // Prepare transportation data
    const transportationData = { ...req.body };

    // Add image paths if images were uploaded
    if (imageFiles && imageFiles.length > 0) {
      transportationData.images = imageFiles.map(file => `/uploads/transportation/${file.filename}`);
    }

    // Parse JSON-like string fields
    const fieldsToParseAsJSON = ['amenities', 'routes', 'destinations', 'contactInfo', 'bookingInformation'];

    fieldsToParseAsJSON.forEach(field => {
      if (transportationData[field] && typeof transportationData[field] === 'string') {
        try {
          transportationData[field] = JSON.parse(transportationData[field]);
        } catch (error) {
          console.warn(`Could not parse ${field}:`, transportationData[field]);
        }
      }
    });
    
    // Convert boolean field
    transportationData.featured = transportationData.featured === 'true';

    // Validate destinations exist if provided
    if (transportationData.destinations && Array.isArray(transportationData.destinations)) {
      for (const destinationId of transportationData.destinations) {
        if (!mongoose.Types.ObjectId.isValid(destinationId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid destination ID: ${destinationId}`
          });
        }
        
        const locationExists = await Location.findById(destinationId);
        if (!locationExists) {
          return res.status(404).json({
            success: false,
            message: `Destination not found: ${destinationId}`
          });
        }
      }
    }

    // Validate routes' from/to locations
    if (transportationData.routes && Array.isArray(transportationData.routes)) {
      for (const route of transportationData.routes) {
        if (!mongoose.Types.ObjectId.isValid(route.from)) {
          return res.status(400).json({
            success: false,
            message: `Invalid 'from' location ID in route: ${route.from}`
          });
        }
        
        if (!mongoose.Types.ObjectId.isValid(route.to)) {
          return res.status(400).json({
            success: false,
            message: `Invalid 'to' location ID in route: ${route.to}`
          });
        }
        
        const fromExists = await Location.findById(route.from);
        if (!fromExists) {
          return res.status(404).json({
            success: false,
            message: `'From' location not found in route: ${route.from}`
          });
        }
        
        const toExists = await Location.findById(route.to);
        if (!toExists) {
          return res.status(404).json({
            success: false,
            message: `'To' location not found in route: ${route.to}`
          });
        }
      }
    }

    // Create transportation
    const newTransportation = await Transportation.create(transportationData);
    
    res.status(201).json({
      success: true,
      data: newTransportation,
    });
  } catch (error) {
    console.error('Error creating transportation:', error);
    
    // Clean up uploaded files if transportation creation fails
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads/transportation', file.filename);
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

// @desc    Get all transportation options
// @route   GET /api/transportation
// @access  Public
exports.getAllTransportation = async (req, res) => {
  try {
    const query = {};
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by operator
    if (req.query.operator) {
      query.operator = { $regex: req.query.operator, $options: 'i' };
    }
    
    // Filter by destination
    if (req.query.destination && mongoose.Types.ObjectId.isValid(req.query.destination)) {
      query.destinations = req.query.destination;
    }
    
    // Filter by route (from/to)
    if (req.query.from && mongoose.Types.ObjectId.isValid(req.query.from)) {
      query['routes.from'] = req.query.from;
    }
    
    if (req.query.to && mongoose.Types.ObjectId.isValid(req.query.to)) {
      query['routes.to'] = req.query.to;
    }
    
    // Filter by amenities
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
    if (req.query.sortBy) {
      const [field, order] = req.query.sortBy.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default sort by newest
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
      data: transportation
    });
  } catch (error) {
    console.error('Get Transportation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single transportation option
// @route   GET /api/transportation/:id
// @access  Public
exports.getTransportation = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transportation ID'
      });
    }
    
    const transportation = await Transportation.findById(req.params.id)
      .populate('destinations', 'name country region description')
      .populate('routes.from routes.to', 'name country region');
    
    if (!transportation) {
      return res.status(404).json({
        success: false,
        message: 'Transportation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transportation
    });
  } catch (error) {
    console.error('Get Transportation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update transportation
// @route   PUT /api/transportation/:id
// @access  Private/Admin
exports.updateTransportation = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transportation ID'
      });
    }
    
    let transportation = await Transportation.findById(req.params.id);
    
    if (!transportation) {
      return res.status(404).json({
        success: false,
        message: 'Transportation not found'
      });
    }
    
    // Prepare update data
    const updateData = { ...req.body };

    // Handle image uploads
    const imageFiles = req.files;
    
    // Add new image paths if images were uploaded
    if (imageFiles && imageFiles.length > 0) {
      // Remove old image files if they exist
      if (transportation.images && transportation.images.length > 0) {
        transportation.images.forEach(imagePath => {
          const fullPath = path.join(__dirname, '../', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }

      updateData.images = imageFiles.map(file => `/uploads/transportation/${file.filename}`);
    }

    // Parse JSON-like string fields
    const fieldsToParseAsJSON = ['amenities', 'routes', 'destinations', 'contactInfo', 'bookingInformation'];

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
    
    // Validate destinations if being updated
    if (updateData.destinations && Array.isArray(updateData.destinations)) {
      for (const destinationId of updateData.destinations) {
        if (!mongoose.Types.ObjectId.isValid(destinationId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid destination ID: ${destinationId}`
          });
        }
        
        const locationExists = await Location.findById(destinationId);
        if (!locationExists) {
          return res.status(404).json({
            success: false,
            message: `Destination not found: ${destinationId}`
          });
        }
      }
    }
    
    // Validate routes if being updated
    if (updateData.routes && Array.isArray(updateData.routes)) {
      for (const route of updateData.routes) {
        if (!mongoose.Types.ObjectId.isValid(route.from)) {
          return res.status(400).json({
            success: false,
            message: `Invalid 'from' location ID in route: ${route.from}`
          });
        }
        
        if (!mongoose.Types.ObjectId.isValid(route.to)) {
          return res.status(400).json({
            success: false,
            message: `Invalid 'to' location ID in route: ${route.to}`
          });
        }
        
        const fromExists = await Location.findById(route.from);
        if (!fromExists) {
          return res.status(404).json({
            success: false,
            message: `'From' location not found in route: ${route.from}`
          });
        }
        
        const toExists = await Location.findById(route.to);
        if (!toExists) {
          return res.status(404).json({
            success: false,
            message: `'To' location not found in route: ${route.to}`
          });
        }
      }
    }
    
    // Update transportation
    transportation = await Transportation.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('destinations', 'name')
      .populate('routes.from routes.to', 'name');
    
    res.status(200).json({
      success: true,
      data: transportation
    });
  } catch (error) {
    console.error('Update Transportation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete transportation
// @route   DELETE /api/transportation/:id
// @access  Private/Admin
exports.deleteTransportation = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transportation ID'
      });
    }
    
    const transportation = await Transportation.findById(req.params.id);
    
    if (!transportation) {
      return res.status(404).json({
        success: false,
        message: 'Transportation not found'
      });
    }
    
    // Remove image files
    if (transportation.images && transportation.images.length > 0) {
      transportation.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    
    // Delete transportation and its reviews
    await TransportationReview.deleteMany({ transportation: req.params.id });
    await Transportation.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Transportation deleted successfully'
    });
  } catch (error) {
    console.error('Delete Transportation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add review to transportation
// @route   POST /api/transportation/:id/reviews
// @access  Private
exports.addTransportationReview = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transportation ID'
      });
    }
    
    const transportation = await Transportation.findById(req.params.id);
    
    if (!transportation) {
      return res.status(404).json({
        success: false,
        message: 'Transportation not found'
      });
    }
    
    // Check if user already reviewed this transportation
    const existingReview = await TransportationReview.findOne({
      transportation: req.params.id,
      user: req.user._id
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You already reviewed this transportation option'
      });
    }
    
    // Create new review
    const review = await TransportationReview.create({
      transportation: req.params.id,
      user: req.user._id,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment
    });
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Add Transportation Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search transportation
// @route   GET /api/transportation/search
// @access  Public
exports.searchTransportation = async (req, res) => {
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
        { operator: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { type: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    // Execute query
    const transportation = await Transportation.find(query)
      .populate('destinations', 'name country')
      .limit(20);
    
    res.status(200).json({
      success: true,
      count: transportation.length,
      data: transportation
    });
  } catch (error) {
    console.error('Search Transportation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Find transportation between two locations
// @route   GET /api/transportation/routes
// @access  Public
exports.findTransportationRoutes = async (req, res) => {
  try {
    const { from, to, type } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Both origin (from) and destination (to) locations are required'
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(from) || !mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location IDs'
      });
    }
    
    // Build query
    const query = {
      'routes.from': from,
      'routes.to': to
    };
    
    // Add type filter if provided
    if (type) {
      query.type = type;
    }
    
    // Execute query
    const transportationOptions = await Transportation.find(query)
      .populate('destinations', 'name country')
      .populate('routes.from routes.to', 'name country region')
      .sort('type');
    
    res.status(200).json({
      success: true,
      count: transportationOptions.length,
      data: transportationOptions
    });
  } catch (error) {
    console.error('Find Transportation Routes Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};