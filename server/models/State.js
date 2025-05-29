// models/State.js
const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a state name'],
    trim: true,
    unique: true,
    maxlength: [100, 'State name cannot be more than 100 characters']
  },
  country: {
    type: String,
    required: [true, 'Please add country name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please specify state type'],
    enum: ['domestic', 'international'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  images: {
    type: [String],
    default: []
  },
  weather: {
    type: String,
    required: [true, 'Please provide weather information']
  },
  bestTimeToVisit: {
    type: String,
    required: [true, 'Please specify the best time to visit']
  },
  popularAttractions: [{
    type: String,
    required: [true, 'Please add at least one popular attraction']
  }],
  localCuisine: [{
    type: String
  }],
  transportation: {
    type: String,
    required: [true, 'Please specify local transportation options']
  },
  culturalNotes: {
    type: String
  },
  cities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }],
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
  toObject: { 
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
  }
});

// Method to get full image URLs
StateSchema.methods.getFullImageUrls = function() {
  return (this.images || []).map(imagePath => 
    imagePath ? `http://localhost:5000${imagePath}` : null
  ).filter(Boolean);
};

module.exports = mongoose.model('State', StateSchema);