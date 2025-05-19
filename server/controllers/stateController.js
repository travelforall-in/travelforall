// controllers/stateController.js
const State = require('../models/State');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// @desc    Create new state
// @route   POST /api/states
// @access  Private/Admin
exports.createState = async (req, res) => {
  try {
    // Handle multiple image uploads
    const imageFiles = req.files;
    
    // Prepare state data
    const stateData = { ...req.body };

    // If images were uploaded, add their paths to the state
    if (imageFiles && imageFiles.length > 0) {
      stateData.images = imageFiles.map(file => `/uploads/states/${file.filename}`);
    }

    // Parse JSON-like string fields
    const fieldsToParseAsJSON = [
      'popularAttractions', 
      'localCuisine'
    ];

    fieldsToParseAsJSON.forEach(field => {
      if (stateData[field] && typeof stateData[field] === 'string') {
        try {
          stateData[field] = JSON.parse(stateData[field]);
        } catch (error) {
          console.warn(`Could not parse ${field}:`, stateData[field]);
        }
      }
    });

    // Create state
    const newState = await State.create(stateData);
    
    res.status(201).json({
      success: true,
      data: newState,
    });
  } catch (error) {
    console.error('Error creating state:', error);
    
    // Clean up uploaded files if state creation fails
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads/states', file.filename);
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

// @desc    Get all states
// @route   GET /api/states
// @access  Public
exports.getStates = async (req, res) => {
  try {
    const query = {};
    
    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by country if provided
    if (req.query.country) {
      query.country = { $regex: req.query.country, $options: 'i' };
    }
    
    // Filter by name if provided
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }
    
    // Sorting
    const sortOptions = req.query.sort 
      ? req.query.sort.split(',').join(' ')
      : '-createdAt';
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Execute query
    const total = await State.countDocuments(query);
    const states = await State.find(query)
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limit);
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    
    res.status(200).json({
      success: true,
      count: states.length,
      total,
      pagination,
      data: states,
    });
  } catch (error) {
    console.error('Get States Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single state
// @route   GET /api/states/:id
// @access  Public
exports.getState = async (req, res) => {
  try {
    const state = await State.findById(req.params.id).populate('cities');
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: state,
    });
  } catch (error) {
    console.error('Get State Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update state
// @route   PUT /api/states/:id
// @access  Private/Admin
exports.updateState = async (req, res) => {
  try {
    let state = await State.findById(req.params.id);
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found',
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle multiple image uploads
    const imageFiles = req.files;
    
    // If new images were uploaded, add their paths to the state
    if (imageFiles && imageFiles.length > 0) {
      // Remove old image files if they exist
      if (state.images && state.images.length > 0) {
        state.images.forEach(imagePath => {
          const fullPath = path.join(__dirname, '../', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }

      // Add new image paths
      updateData.images = imageFiles.map(file => `/uploads/states/${file.filename}`);
    }

    // Parse JSON-like string fields
    const fieldsToParseAsJSON = [
      'popularAttractions', 
      'localCuisine'
    ];

    fieldsToParseAsJSON.forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (error) {
          console.warn(`Could not parse ${field}:`, updateData[field]);
        }
      }
    });
    
    // Update state
    state = await State.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    );
    
    res.status(200).json({
      success: true,
      data: state,
    });
  } catch (error) {
    console.error('Update State Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete state
// @route   DELETE /api/states/:id
// @access  Private/Admin
exports.deleteState = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found',
      });
    }
    
    // Remove associated image files
    if (state.images && state.images.length > 0) {
      state.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    
    await State.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {},
      message: 'State deleted successfully'
    });
  } catch (error) {
    console.error('Delete State Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get states by type (domestic or international)
// @route   GET /api/states/type/:type
// @access  Public
exports.getStatesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (type !== 'domestic' && type !== 'international') {
      return res.status(400).json({
        success: false,
        message: 'Type must be either domestic or international',
      });
    }
    
    const states = await State.find({ type });
    
    res.status(200).json({
      success: true,
      count: states.length,
      data: states,
    });
  } catch (error) {
    console.error('Get States by Type Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search states by name or country
// @route   GET /api/states/search
// @access  Public
exports.searchStates = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search keyword',
      });
    }
    
    const states = await State.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { country: { $regex: keyword, $options: 'i' } }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: states.length,
      data: states,
    });
  } catch (error) {
    console.error('Search States Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get cities by state ID
// @route   GET /api/states/:id/cities
// @access  Public
exports.getCitiesByState = async (req, res) => {
  try {
    // Validate state ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state ID format'
      });
    }
    
    // Check if state exists
    const state = await State.findById(req.params.id);
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }
    
    // Get cities for this state
    const City = require('../models/City');
    const cities = await City.find({ state: req.params.id });
    
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
      stateInfo: {
        name: state.name,
        country: state.country,
        type: state.type
      }
    });
  } catch (error) {
    console.error('Get Cities by State Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get packages by state ID
// @route   GET /api/states/:id/packages
// @access  Public
exports.getPackagesByState = async (req, res) => {
  try {
    // Validate state ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state ID format'
      });
    }
    
    // Check if state exists
    const state = await State.findById(req.params.id);
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }
    
    // Get packages for this state
    const Package = require('../models/Package');
    const packages = await Package.find({ state: req.params.id })
                                 .populate('city', 'name country');
    
    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
      stateInfo: {
        name: state.name,
        country: state.country,
        type: state.type
      }
    });
  } catch (error) {
    console.error('Get Packages by State Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};