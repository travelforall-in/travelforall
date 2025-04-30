// models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a location name'],
    trim: true,
    unique: true
  },
  country: {
    type: String,
    required: [true, 'Please add a country']
  },
  region: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  images: {
    type: [String],
    default: []
  },
  attractions: [{
    name: String,
    description: String,
    image: String
  }],
  bestTimeToVisit: {
    type: String
  },
  travelTips: {
    type: [String]
  },
  weather: {
    summer: String,
    winter: String,
    rainy: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  popularityIndex: {
    type: Number,
    default: 0
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

// Virtual for hotels in this location
LocationSchema.virtual('hotels', {
  ref: 'Hotel',
  localField: '_id',
  foreignField: 'location',
  justOne: false
});

// Virtual for transportation options to this location
LocationSchema.virtual('transportationOptions', {
  ref: 'Transportation',
  localField: '_id',
  foreignField: 'destinations',
  justOne: false
});

module.exports = mongoose.model('Location', LocationSchema);