// models/User.js - Update your existing User model with these preferences
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  
  // Add preferences for custom packages
  preferences: {
    // Travel preferences
    preferredDestinations: [String],
    preferredActivities: [String],
    preferredAccommodations: {
      type: [String],
      enum: ['hotel', 'resort', 'hostel', 'guesthouse', 'apartment'],
      default: ['hotel']
    },
    // Budget preferences
    budgetRange: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 1000000
      }
    },
    // Travel style
    travelStyle: {
      type: String,
      enum: ['luxury', 'comfort', 'budget', 'adventure', 'family', 'solo', 'couple'],
      default: 'comfort'
    },
    // Transportation preferences
    transportPreferences: {
      flight: {
        preferredClass: {
          type: String,
          enum: ['economy', 'premium_economy', 'business', 'first'],
          default: 'economy'
        }
      },
      localTransport: {
        type: String,
        enum: ['public', 'private', 'rental'],
        default: 'private'
      }
    },
    // Dining preferences
    diningPreferences: [String],
    // Special requirements
    specialRequirements: [String]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);