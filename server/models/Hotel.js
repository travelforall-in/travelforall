// models/Hotel.js (Modified to include vendor reference)
const mongoose = require('mongoose');

const HotelReviewSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  title: {
    type: String,
    required: [true, 'Please add a review title'],
    maxlength: 100
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: 500
  }
}, {
  timestamps: true
});

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add hotel name'],
    trim: true,
    maxlength: [100, 'Hotel name cannot be more than 100 characters']
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'VendorAdmin',
    required: [true, 'Hotel must belong to a vendor']
  },
  location: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
    required: [true, 'Please add a location']
  },
  address: {
    type: String,
    required: [true, 'Please add hotel address']
  },
  description: {
    type: String,
    required: [true, 'Please add hotel description']
  },
  category: {
    type: String,
    required: [true, 'Please add hotel category'],
    enum: ['budget', 'standard', 'premium', 'luxury', 'resort']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  priceRange: {
    min: {
      type: Number,
      required: [true, 'Please add minimum price']
    },
    max: {
      type: Number,
      required: [true, 'Please add maximum price']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  roomTypes: [{
    name: String,
    description: String,
    capacity: Number,
    price: Number,
    amenities: [String],
    available: {
      type: Boolean,
      default: true
    }
  }],
  amenities: [{
    type: String,
    enum: [
      'wifi', 'parking', 'pool', 'gym', 'spa', 'restaurant', 
      'bar', 'room_service', 'laundry', 'concierge', 'business_center',
      'pet_friendly', 'air_conditioning', 'elevator', 'disabled_access'
    ]
  }],
  images: [{
    type: String,
    required: [true, 'Please add at least one image']
  }],
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Please add contact phone']
    },
    email: {
      type: String,
      required: [true, 'Please add contact email']
    },
    website: String
  },
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String,
    petPolicy: String,
    smokingPolicy: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending_approval', 'suspended'],
    default: 'pending_approval'
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'HotelReview'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating
HotelSchema.virtual('averageRating').get(function() {
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((total / this.reviews.length) * 10) / 10;
  }
  return this.rating;
});

// Virtual for total reviews count
HotelSchema.virtual('reviewCount').get(function() {
  return this.reviews ? this.reviews.length : 0;
});

// Index for better search performance
HotelSchema.index({ name: 'text', description: 'text', address: 'text' });
HotelSchema.index({ location: 1, category: 1, status: 1 });
HotelSchema.index({ vendor: 1, status: 1 });

const Hotel = mongoose.model('Hotel', HotelSchema);
const HotelReview = mongoose.model('HotelReview', HotelReviewSchema);

module.exports = { Hotel, HotelReview };