// models/Package.js (Updated)
const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a package name'],
    trim: true,
    maxlength: [100, 'Package name cannot be more than 100 characters'],
  },
  type: {
    type: String,
    required: [true, 'Please specify package type'],
    enum: ['domestic', 'international'],
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination'],
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: [true, 'Please select a city']
  },
  duration: {
    days: {
      type: Number,
      required: [true, 'Please add number of days'],
    },
    nights: {
      type: Number,
      required: [true, 'Please add number of nights'],
    },
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  highlights: [{
    type: String,
    required: [true, 'Please add at least one highlight'],
  }],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    meals: {
      breakfast: Boolean,
      lunch: Boolean,
      dinner: Boolean,
    },
  }],
  inclusions: [{
    type: String,
  }],
  exclusions: [{
    type: String,
  }],
  transportation: {
    type: String,
    required: [true, 'Please specify transportation type'],
    enum: ['flight', 'train', 'bus', 'cruise', 'self-drive', 'mixed'],
  },
  accommodation: {
    type: String,
    required: [true, 'Please specify accommodation type'],
  },
    // models/Package.js - Add this field to your existing Package schema
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  images: {
    type: [String],
    default: []
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  averageRating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  bookingsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  // Add virtual options
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Safely handle fullImageUrls
      if (ret.images && Array.isArray(ret.images)) {
        ret.fullImageUrls = ret.images.map(imagePath => 
          imagePath ? `http://localhost:5000${imagePath}` : null
        ).filter(Boolean);
      } else {
        ret.fullImageUrls = [];
      }
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Safely handle fullImageUrls
      if (ret.images && Array.isArray(ret.images)) {
        ret.fullImageUrls = ret.images.map(imagePath => 
          imagePath ? `http://localhost:5000${imagePath}` : null
        ).filter(Boolean);
      } else {
        ret.fullImageUrls = [];
      }
      return ret;
    }
  }
});

// Calculate average rating method
PackageSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.averageRating = totalRating / this.reviews.length;
};

// Method to get full image URLs
PackageSchema.methods.getFullImageUrls = function() {
  return (this.images || []).map(imagePath => 
    imagePath ? `http://localhost:5000${imagePath}` : null
  ).filter(Boolean);
};

module.exports = mongoose.model('Package', PackageSchema);