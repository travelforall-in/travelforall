// models/HotelBooking.js
const mongoose = require('mongoose');

const HotelBookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    unique: true,
    required: false // Will be generated in pre-save
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: [true, 'Booking must be for a hotel']
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'VendorAdmin',
    required: false // Will be set based on hotel
  },
  roomDetails: {
    roomType: {
      type: String,
      required: [true, 'Please specify room type']
    },
    numberOfRooms: {
      type: Number,
      required: [true, 'Please specify number of rooms'],
      min: 1
    },
    pricePerRoom: {
      type: Number,
      required: [true, 'Please specify price per room']
    }
  },
  guestDetails: {
    adults: {
      type: Number,
      required: [true, 'Please specify number of adults'],
      min: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    },
    infants: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  stayDetails: {
    checkInDate: {
      type: Date,
      required: [true, 'Please specify check-in date']
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please specify check-out date']
    },
    numberOfNights: {
      type: Number,
      required: false // Will be calculated in pre-save
    }
  },
  contactDetails: {
    primaryGuest: {
      name: {
        type: String,
        required: [true, 'Please provide primary guest name']
      },
      email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email'
        ]
      },
      phone: {
        type: String,
        required: [true, 'Please provide phone number']
      }
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  pricing: {
    roomTotal: {
      type: Number,
      required: false // Will be calculated
    },
    taxes: {
      type: Number,
      default: 0
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: false // Will be calculated
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash'],
      required: [true, 'Please specify payment method']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAmount: {
      type: Number,
      default: 0
    },
    refundAmount: {
      type: Number,
      default: 0
    }
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'checked_in', 'checked_out', 'no_show'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: 500
  },
  cancellationDetails: {
    cancelledAt: Date,
    cancelledBy: {
      type: String,
      enum: ['user', 'vendor', 'admin']
    },
    cancellationReason: String,
    refundStatus: {
      type: String,
      enum: ['not_applicable', 'pending', 'processed', 'rejected']
    }
  },
  vendorNotes: {
    type: String,
    maxlength: 1000
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Generate booking reference and calculate fields before saving
HotelBookingSchema.pre('save', async function(next) {
  // Only run on new documents
  if (!this.isNew) {
    return next();
  }

  try {
    // Generate unique booking reference
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingReference = `HB${timestamp.slice(-6)}${random}`;
    
    // Calculate number of nights
    const checkIn = new Date(this.stayDetails.checkInDate);
    const checkOut = new Date(this.stayDetails.checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    this.stayDetails.numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Calculate pricing
    const nights = this.stayDetails.numberOfNights;
    const rooms = this.roomDetails.numberOfRooms;
    const pricePerRoom = this.roomDetails.pricePerRoom;
    
    this.pricing.roomTotal = pricePerRoom * rooms * nights;
    this.pricing.taxes = this.pricing.roomTotal * 0.12; // 12% tax
    this.pricing.serviceFee = this.pricing.roomTotal * 0.05; // 5% service fee
    this.pricing.totalAmount = this.pricing.roomTotal + this.pricing.taxes + this.pricing.serviceFee - this.pricing.discount;

    // Get hotel to set vendor
    if (this.hotel) {
      const Hotel = require('./Hotel').Hotel;
      const hotel = await Hotel.findById(this.hotel).populate('vendor');
      if (hotel && hotel.vendor) {
        this.vendor = hotel.vendor._id;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Indexes for better performance
HotelBookingSchema.index({ user: 1, bookingStatus: 1 });
HotelBookingSchema.index({ hotel: 1, bookingStatus: 1 });
HotelBookingSchema.index({ vendor: 1, bookingStatus: 1 });
HotelBookingSchema.index({ bookingReference: 1 });
HotelBookingSchema.index({ 'stayDetails.checkInDate': 1, 'stayDetails.checkOutDate': 1 });

module.exports = mongoose.model('HotelBooking', HotelBookingSchema);