// models/Transportation.js
const mongoose = require('mongoose');

const TransportationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a transportation name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['bus', 'train', 'flight', 'ferry', 'cruise', 'taxi','Bus'],
    required: [true, 'Please specify transportation type']
  },
  operator: {
    type: String,
    required: [true, 'Please add an operator name']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  images: {
    type: [String],
    default: []
  },
  destinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }],
  routes: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true
    },
    departureTime: String,
    arrivalTime: String,
    durationHours: Number,
    frequency: String, // Daily, Weekly, etc.
    price: Number,
    availableDays: [String] // Monday, Tuesday, etc.
  }],
  amenities: {
    type: [String],
    default: []
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  bookingInformation: {
    howToBook: String,
    cancellationPolicy: String
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

module.exports = mongoose.model('Transportation', TransportationSchema);

// Create TransportationReview model
const TransportationReviewSchema = new mongoose.Schema({
  transportation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transportation',
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

// Prevent users from submitting more than one review per transportation
TransportationReviewSchema.index({ transportation: 1, user: 1 }, { unique: true });

module.exports.TransportationReview = mongoose.model('TransportationReview', TransportationReviewSchema);