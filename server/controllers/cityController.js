// controllers/cityController.js
const City = require('../models/City');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// @desc    Create new city
// @route   POST /api/cities
// @access  Private/Admin
exports.createCity = async (req, res) => {
  try {
    // Handle multiple image uploads
    const imageFiles = req.files;
    
    // Prepare city data
    const cityData = { ...req.body };

    // If images were uploaded, add their paths to the city
    if (imageFiles && imageFiles.length > 0) {
      cityData.images = imageFiles.map(file => `/uploads/cities/${file.filename}`);
    }

    // Parse JSON-like string fields
    const fieldsToParseAsJSON = [
      'popularAttractions', 
      'localCuisine'
    ];

    fieldsToParseAsJSON.forEach(field => {
      if (cityData[field] && typeof cityData[field] === 'string') {
        try {
          cityData[field] = JSON.parse(cityData[field]);
        } catch (error) {
          console.warn(`Could not parse ${field}:`, cityData[field]);
        }
      }
    });

    // Validate state if provided
    if (cityData.state) {
      const State = require('../models/State');
      const stateExists = await State.findById(cityData.state);
      
      if (!stateExists) {
        return res.status(404).json({
          success: false,
          message: 'State not found with the provided ID',
        });
      }
      
      // If type is not provided, use state type
      if (!cityData.type) {
        cityData.type = stateExists.type;
      }
      
      // If country is not provided, use state country
      if (!cityData.country) {
        cityData.country = stateExists.country;
      }
    }

    // Create city
    const newCity = await City.create(cityData);
    
    // If state is provided, add this city to the state's cities array
    if (cityData.state) {
      await State.findByIdAndUpdate(
        cityData.state,
        { $push: { cities: newCity._id } }
      );
    }
    
    res.status(201).json({
      success: true,
      data: newCity,
    });
  } catch (error) {
    console.error('Error creating city:', error);
    
    // Clean up uploaded files if city creation fails
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads/cities', file.filename);
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

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
// Update getCities to populate state
exports.getCities = async (req, res) => {
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
    
    // Filter by state if provided
    if (req.query.state) {
      query.state = req.query.state;
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
    
    // Execute query with state population
    const total = await City.countDocuments(query);
    const cities = await City.find(query)
      .populate('state', 'name country type')
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
      count: cities.length,
      total,
      pagination,
      data: cities,
    });
  } catch (error) {
    console.error('Get Cities Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single city
// @route   GET /api/cities/:id
// @access  Public
// Update getCity to populate state
exports.getCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id).populate('state', 'name country type');
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error('Get City Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// @desc    Update city
// @route   PUT /api/cities/:id
// @access  Private/Admin
exports.updateCity = async (req, res) => {
  try {
    let city = await City.findById(req.params.id);
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle multiple image uploads
    const imageFiles = req.files;
    
    // If new images were uploaded, add their paths to the city
    if (imageFiles && imageFiles.length > 0) {
      // Remove old image files if they exist
      if (city.images && city.images.length > 0) {
        city.images.forEach(imagePath => {
          const fullPath = path.join(__dirname, '../', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }

      // Add new image paths
      updateData.images = imageFiles.map(file => `/uploads/cities/${file.filename}`);
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
    
    // Update city
    city = await City.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    );
    
    res.status(200).json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error('Update City Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete city
// @route   DELETE /api/cities/:id
// @access  Private/Admin
exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
      });
    }
    
    // Remove associated image files
    if (city.images && city.images.length > 0) {
      city.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    
    await City.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {},
      message: 'City deleted successfully'
    });
  } catch (error) {
    console.error('Delete City Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get cities by type (domestic or international)
// @route   GET /api/cities/type/:type
// @access  Public
exports.getCitiesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (type !== 'domestic' && type !== 'international') {
      return res.status(400).json({
        success: false,
        message: 'Type must be either domestic or international',
      });
    }
    
    const cities = await City.find({ type });
    
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    console.error('Get Cities by Type Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search cities by name or country
// @route   GET /api/cities/search
// @access  Public
exports.searchCities = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search keyword',
      });
    }
    
    const cities = await City.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { country: { $regex: keyword, $options: 'i' } }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    console.error('Search Cities Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get packages by city ID
// @route   GET /api/cities/:id/packages
// @access  Public
exports.getPackagesByCity = async (req, res) => {
  try {
    // Validate city ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid city ID format'
      });
    }
    
    // Check if city exists
    const city = await City.findById(req.params.id);
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    // Get packages for this city
    const Package = require('../models/Package');
    const packages = await Package.find({ city: req.params.id });
    
    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
      cityInfo: {
        name: city.name,
        country: city.country,
        type: city.type
      }
    });
  } catch (error) {
    console.error('Get Packages by City Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};