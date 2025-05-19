const Package = require('../models/Package');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const CustomPackage = require('../models/CustomPackage');
const Wishlist = require('../models/Wishlist');

// @desc    Create new package
// @route   POST /api/packages
// @access  Private/Admin
exports.createPackage = async (req, res) => {
  try {
    // Handle multiple image uploads
    const imageFiles = req.files;

    // Prepare package data
    const packageData = { ...req.body };

    // If images were uploaded, add their paths to the package
    if (imageFiles && imageFiles.length > 0) {
      packageData.images = imageFiles.map(file => `/uploads/packages/${file.filename}`);
    }

    // Parse JSON-like string fields
    const fieldsToParseAsJSON = [
      'highlights',
      'inclusions',
      'exclusions',
      'itinerary'
    ];

    fieldsToParseAsJSON.forEach(field => {
      if (packageData[field] && typeof packageData[field] === 'string') {
        try {
          packageData[field] = JSON.parse(packageData[field]);
        } catch (error) {
          console.warn(`Could not parse ${field}:`, packageData[field]);
        }
      }
    });

    // Handle nested duration
    if (packageData['duration.days'] || packageData['duration.nights']) {
      packageData.duration = {
        days: parseInt(packageData['duration.days']),
        nights: parseInt(packageData['duration.nights'])
      };
    }

    // Convert primitive fields
    if (packageData.price) packageData.price = parseFloat(packageData.price);
    packageData.featured = packageData.featured === 'true';

    // Validate city exists
    if (packageData.city) {
      const City = require('../models/City');
      const cityExists = await City.findById(packageData.city);

      if (!cityExists) {
        return res.status(404).json({
          success: false,
          message: 'City not found with the provided ID',
        });
      }

      // If destination is not provided but city is, use city name as destination
      if (!packageData.destination) {
        packageData.destination = cityExists.name;
      }

      // If type is not provided, use city type
      if (!packageData.type) {
        packageData.type = cityExists.type;
      }
    }

    // Validate state exists
    if (packageData.state) {
      const State = require('../models/State');
      const stateExists = await State.findById(packageData.state);

      if (!stateExists) {
        return res.status(404).json({
          success: false,
          message: 'State not found with the provided ID',
        });
      }

      // If type is not provided, use state type
      if (!packageData.type) {
        packageData.type = stateExists.type;
      }
    }

    // Create package
    const newPackage = await Package.create(packageData);

    // Populate city information for the response
    await newPackage.populate('city');

    res.status(201).json({
      success: true,
      data: newPackage,
    });
  } catch (error) {
    console.error('Error creating package:', error);

    // Clean up uploaded files if package creation fails
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads/packages', file.filename);
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

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
exports.getPackages = async (req, res) => {
  try {
    const query = {};

    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by price range if provided
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = {
        $gte: parseFloat(req.query.minPrice),
        $lte: parseFloat(req.query.maxPrice)
      };
    } else if (req.query.minPrice) {
      query.price = { $gte: parseFloat(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      query.price = { $lte: parseFloat(req.query.maxPrice) };
    }

    // Filter by destination if provided
    if (req.query.destination) {
      query.destination = { $regex: req.query.destination, $options: 'i' };
    }

    // Filter by city if provided
    if (req.query.city) {
      query.city = req.query.city;
    }

    // Filter by state if provided
    if (req.query.state) {
      query.state = req.query.state;
    }

    // Filter by duration if provided
    if (req.query.duration) {
      query['duration.days'] = { $lte: parseInt(req.query.duration) };
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

    // Execute query with city and state population
    const total = await Package.countDocuments(query);
    const packages = await Package.find(query)
      .populate('city', 'name country type')
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
      count: packages.length,
      total,
      pagination,
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

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
exports.getPackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    // Validate package ID (extra safeguard)
    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID format'
      });
    }

    // Fetch package with city and state information
    const package = await Package.findById(packageId)
      .populate('city')
      .populate('state');

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Get Package Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
exports.updatePackage = async (req, res) => {
  try {
    let package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle multiple image uploads
    const imageFiles = req.files;

    // If new images were uploaded, add their paths to the package
    if (imageFiles && imageFiles.length > 0) {
      // Remove old image files if they exist
      if (package.images && package.images.length > 0) {
        package.images.forEach(imagePath => {
          const fullPath = path.join(__dirname, '../', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }

      // Add new image paths
      updateData.images = imageFiles.map(file => `/uploads/packages/${file.filename}`);
    }

    // Parse JSON-like string fields
    const fieldsToParseAsJSON = [
      'highlights',
      'inclusions',
      'exclusions',
      'itinerary'
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

    // Handle nested duration
    if (updateData['duration.days'] || updateData['duration.nights']) {
      updateData.duration = {
        days: parseInt(updateData['duration.days']),
        nights: parseInt(updateData['duration.nights'])
      };
    }

    // Convert primitive fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    updateData.featured = updateData.featured === 'true';

    // Update package
    package = await Package.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: package,
    });
  } catch (error) {
    console.error('Update Package Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    // Remove associated image files
    if (package.images && package.images.length > 0) {
      package.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await Package.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete Package Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add review to package
// @route   POST /api/packages/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    const { rating, comment } = req.body;

    // Check if the user has already reviewed this package
    const alreadyReviewed = package.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Package already reviewed',
      });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };

    package.reviews.push(review);

    // Calculate average rating
    package.calculateAverageRating();

    await package.save();

    res.status(201).json({
      success: true,
      message: 'Review added',
    });
  } catch (error) {
    console.error('Add Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get featured packages
// @route   GET /api/packages/featured
// @access  Public
exports.getFeaturedPackages = async (req, res) => {
  try {
    const featuredPackages = await Package.find({ featured: true }).limit(6);

    res.status(200).json({
      success: true,
      count: featuredPackages.length,
      data: featuredPackages,
    });
  } catch (error) {
    console.error('Get Featured Packages Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get packages by type (domestic or international or custom)
// @route   GET /api/packages/type/:type
// @access  Public
exports.getPackagesByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (type !== 'domestic' && type !== 'international' && type !== 'custom') {
      return res.status(400).json({
        success: false,
        message: 'Type must be either domestic, international, or custom',
      });
    }

    // If type is 'custom', redirect to custom package endpoint
    if (type === 'custom') {
      return res.status(200).json({
        success: true,
        message: 'For custom packages, please use the /api/custom-packages endpoint',
      });
    }

    const packages = await Package.find({ type });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (error) {
    console.error('Get Packages by Type Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search packages by name, city, or type
// @route   GET /api/packages/search
// @access  Public
exports.searchPackages = async (req, res) => {
  try {
    const { keyword, type, minPrice, maxPrice, duration, city, cityId } = req.query;

    const query = {};

    // Search by city ID if provided
    if (cityId) {
      query.city = cityId;
    }

    // Search by city name if provided and not searching by city ID
    if (city && !cityId) {
      // First, find cities that match the name
      const City = require('../models/City');
      const cities = await City.find({
        name: { $regex: city, $options: 'i' }
      }).select('_id');

      if (cities.length > 0) {
        // If cities found, search packages with those city IDs
        query.city = { $in: cities.map(c => c._id) };
      } else {
        // If no cities found, search in destination field as fallback
        query.destination = { $regex: city, $options: 'i' };
      }
    }

    // Search by keyword in name or destination if no specific city
    if (keyword && !city && !cityId) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { destination: { $regex: keyword, $options: 'i' } },
      ];
    } else if (keyword) {
      // If city is specified, only search by name
      query.name = { $regex: keyword, $options: 'i' };
    }

    // Exact match for package type
    if (type) {
      query.type = type;
    }

    // Filter by price range
    if (minPrice && maxPrice) {
      query.price = {
        $gte: parseFloat(minPrice),
        $lte: parseFloat(maxPrice)
      };
    } else if (minPrice) {
      query.price = { $gte: parseFloat(minPrice) };
    } else if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    // Filter by duration
    if (duration) {
      query['duration.days'] = { $lte: parseInt(duration) };
    }

    const packages = await Package.find(query)
      .populate('city', 'name country type')
      .populate('state', 'name country type')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (error) {
    console.error('Search Packages Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get most popular packages
// @route   GET /api/packages/popular
// @access  Public
exports.getMostPopularPackages = async (req, res) => {
  try {
    const { sortBy = 'bookings', limit = 5 } = req.query;

    let popularPackages;

    if (sortBy === 'ratings') {
      // Get packages sorted by highest average rating
      popularPackages = await Package.find({
        // Only consider packages with at least one review
        reviews: { $exists: true, $not: {$size: 0} }
      })
      .sort({ averageRating: -1 })
      .limit(parseInt(limit));
    } else {
      // Default: Get packages sorted by most bookings
      popularPackages = await Package.find()
        .sort({ bookingsCount: -1 })
        .limit(parseInt(limit));
    }

    res.status(200).json({
      success: true,
      count: popularPackages.length,
      data: popularPackages,
    });
  } catch (error) {
    console.error('Get Popular Packages Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create custom package request
// @route   POST /api/packages/custom
// @access  Private
exports.createCustomPackage = async (req, res) => {
  try {
    const {
      name,
      destination,
      startDate,
      endDate,
      accommodation,
      transportation,
      meals,
      activities,
      budget,
      travelers,
      specialRequests
    } = req.body;

    // Create custom package
    const customPackage = await CustomPackage.create({
      user: req.user._id,
      name,
      destination,
      startDate,
      endDate,
      accommodation,
      transportation,
      meals,
      activities,
      budget,
      travelers,
      specialRequests,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: customPackage
    });
  } catch (error) {
    console.error('Create Custom Package Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get custom package by ID
// @route   GET /api/packages/custom/:id
// @access  Private
exports.getCustomPackage = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid custom package ID'
      });
    }

    const customPackage = await CustomPackage.findById(req.params.id);

    if (!customPackage) {
      return res.status(404).json({
        success: false,
        message: 'Custom package not found'
      });
    }

    // Check if user is owner of the package or an admin
    if (
      customPackage.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this custom package'
      });
    }

    res.status(200).json({
      success: true,
      data: customPackage
    });
  } catch (error) {
    console.error('Get Custom Package Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add package to wishlist
// @route   POST /api/packages/wishlist/:id
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const packageId = req.params.id;

    // Validate package ID
    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID'
      });
    }

    // Validate package exists
    const packageExists = await Package.findById(packageId);
    if (!packageExists) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Find user's wishlist or create if doesn't exist
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        packages: [packageId]
      });
    } else {
      // Check if package already in wishlist
      if (wishlist.packages.includes(packageId)) {
        return res.status(400).json({
          success: false,
          message: 'Package already in wishlist'
        });
      }

      // Add to wishlist
      wishlist.packages.push(packageId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Package added to wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Add to Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's wishlist
// @route   GET /api/packages/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('packages', 'name type destination price duration images averageRating');

    // If no wishlist found, return empty array
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: wishlist.packages.length,
      data: wishlist.packages
    });
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove package from wishlist
// @route   DELETE /api/packages/wishlist/:id
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const packageId = req.params.id;

    // Validate package ID
    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID'
      });
    }

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Check if package in wishlist
    const packageIndex = wishlist.packages.findIndex(
      id => id.toString() === packageId
    );

    if (packageIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Package not in wishlist'
      });
    }

    // Remove from wishlist
    wishlist.packages.splice(packageIndex, 1);
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Package removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Remove from Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get packages by city
// @route   GET /api/packages/city/:cityName
// @access  Public
exports.getPackagesByCity = async (req, res) => {
  try {
    const { cityName } = req.params;

    // Find packages that have this city as destination
    const packages = await Package.find({
      destination: { $regex: new RegExp(cityName, 'i') }
    });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
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

// @desc    Get all domestic city names
// @route   GET /api/packages/cities/domestic
// @access  Public
exports.getDomesticCities = async (req, res) => {
  try {
    // Find all domestic packages and extract unique city names
    const domesticPackages = await Package.find({ type: 'domestic' })
      .select('destination')
      .lean();

    // Extract and deduplicate city names
    const cityNames = [...new Set(domesticPackages.map(pkg => pkg.destination))];

    // Sort alphabetically
    cityNames.sort();

    res.status(200).json({
      success: true,
      count: cityNames.length,
      data: cityNames,
    });
  } catch (error) {
    console.error('Get Domestic Cities Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all international country names
// @route   GET /api/packages/countries/international
// @access  Public
exports.getInternationalCountries = async (req, res) => {
  try {
    // Find all international packages and extract unique country names
    const internationalPackages = await Package.find({ type: 'international' })
      .select('destination')
      .lean();

    // Extract and deduplicate country names
    const countryNames = [...new Set(internationalPackages.map(pkg => pkg.destination))];

    // Sort alphabetically
    countryNames.sort();

    res.status(200).json({
      success: true,
      count: countryNames.length,
      data: countryNames,
    });
  } catch (error) {
    console.error('Get International Countries Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get packages by state
// @route   GET /api/packages/state/:stateId
// @access  Public
// packageController.js
exports.getPackagesByState = async (req, res) => {
  try {
    const { stateId } = req.params;

    // Validate state ID
    if (!mongoose.Types.ObjectId.isValid(stateId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state ID format'
      });
    }

    // Find packages with this state
    const packages = await Package.find({ state: stateId })
      .populate('city', 'name country type')
      .populate('state', 'name country type');

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
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


// @desc    Get all domestic state names
// @route   GET /api/packages/states/domestic
// @access  Public
exports.getDomesticStates = async (req, res) => {
  try {
    // Find all states with type domestic
    const State = require('../models/State');
    const domesticStates = await State.find({ type: 'domestic' })
      .select('name country')
      .sort('name')
      .lean();

    res.status(200).json({
      success: true,
      count: domesticStates.length,
      data: domesticStates,
    });
  } catch (error) {
    console.error('Get Domestic States Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all international state names
// @route   GET /api/packages/states/international
// @access  Public
exports.getInternationalStates = async (req, res) => {
  try {
    // Find all states with type international
    const State = require('../models/State');
    const internationalStates = await State.find({ type: 'international' })
      .select('name country')
      .sort('name')
      .lean();

    res.status(200).json({
      success: true,
      count: internationalStates.length,
      data: internationalStates,
    });
  } catch (error) {
    console.error('Get International States Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
