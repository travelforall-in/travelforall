// models/Hotel.js
const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hotel name'],
    trim: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: [true, 'Please specify a location']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  category: {
    type: String,
    enum: ['budget', 'standard', 'premium', 'luxury', 'resort'],
    required: [true, 'Please specify hotel category']
  },
  amenities: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  priceRange: {
    min: {
      type: Number,
      required: [true, 'Please specify minimum price']
    },
    max: {
      type: Number,
      required: [true, 'Please specify maximum price']
    }
  },
  roomTypes: [{
    type: {
      type: String,
      required: [true, 'Please specify room type']
    },
    sleeps: {
      type: Number,
      required: [true, 'Please specify room capacity']
    },
    price: {
      type: Number,
      required: [true, 'Please specify room price']
    },
    amenities: [String],
    description: String
  }],
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
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
  toObject: { virtuals: true }
});

// Virtual for reviews
HotelSchema.virtual('reviews', {
  ref: 'HotelReview',
  localField: '_id',
  foreignField: 'hotel',
  justOne: false
});

module.exports = mongoose.model('Hotel', HotelSchema);

// Create Hotel Review model
const HotelReviewSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent users from submitting more than one review per hotel
HotelReviewSchema.index({ hotel: 1, user: 1 }, { unique: true });

module.exports.HotelReview = mongoose.model('HotelReview', HotelReviewSchema);