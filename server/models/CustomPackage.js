const mongoose = require('mongoose');

const CustomPackageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name for your custom package']
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  accommodation: {
    type: {
      type: String,
      enum: ['hotel', 'resort', 'hostel', 'guesthouse', 'apartment'],
      required: true
    },
    preferredRating: {
      type: Number,
      min: 1,
      max: 5
    },
    requirements: [String]
  },
  transportation: {
    flights: {
      required: Boolean,
      preferredClass: {
        type: String,
        enum: ['economy', 'premium_economy', 'business', 'first']
      }
    },
    localTransport: {
      type: String,
      enum: ['public', 'private', 'rental']
    }
  },
  meals: {
    included: Boolean,
    preferences: [String]
  },
  activities: [String],
  budget: {
    type: Number,
    required: [true, 'Please specify your budget']
  },
  travelers: {
    adults: {
      type: Number,
      required: [true, 'Please specify number of adults'],
      min: 1
    },
    children: {
      type: Number,
      default: 0
    },
    infants: {
      type: Number,
      default: 0
    }
  },
  specialRequests: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'quoted', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  quote: {
    amount: Number,
    expiresAt: Date,
    details: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CustomPackage', CustomPackageSchema);