// controllers/vendorDashboardController.js
const { Hotel } = require('../models/Hotel');
const HotelBooking = require('../models/HotelBooking');
const mongoose = require('mongoose');

// @desc    Get vendor dashboard statistics
// @route   GET /api/vendor/dashboard/stats
// @access  Private/Vendor
exports.getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    
    // Date calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalHotels,
      activeHotels,
      pendingHotels,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      monthlyBookings,
      lastMonthBookings,
      totalRevenue,
      monthlyRevenue,
      recentBookings,
      upcomingCheckIns,
      hotelPerformance,
      bookingTrends,
      paymentStatus
    ] = await Promise.all([
      // Hotel statistics
      Hotel.countDocuments({ vendor: vendorId }),
      Hotel.countDocuments({ vendor: vendorId, status: 'active' }),
      Hotel.countDocuments({ vendor: vendorId, status: 'pending_approval' }),
      
      // Booking statistics
      HotelBooking.countDocuments({ vendor: vendorId }),
      HotelBooking.countDocuments({ vendor: vendorId, bookingStatus: 'confirmed' }),
      HotelBooking.countDocuments({ vendor: vendorId, bookingStatus: 'pending' }),
      HotelBooking.countDocuments({ vendor: vendorId, createdAt: { $gte: startOfMonth } }),
      HotelBooking.countDocuments({ 
        vendor: vendorId, 
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
      }),
      
      // Revenue statistics
      HotelBooking.aggregate([
        { 
          $match: { 
            vendor: vendorId, 
            'paymentDetails.paymentStatus': 'completed' 
          } 
        },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      HotelBooking.aggregate([
        { 
          $match: { 
            vendor: vendorId, 
            'paymentDetails.paymentStatus': 'completed',
            createdAt: { $gte: startOfMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      
      // Recent bookings (last 5)
      HotelBooking.find({ vendor: vendorId })
        .populate('hotel', 'name')
        .populate('user', 'name email')
        .sort('-createdAt')
        .limit(5)
        .select('bookingReference contactDetails.primaryGuest.name stayDetails bookingStatus pricing.totalAmount'),
      
      // Upcoming check-ins (next 7 days)
      HotelBooking.find({
        vendor: vendorId,
        bookingStatus: 'confirmed',
        'stayDetails.checkInDate': {
          $gte: now,
          $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      })
        .populate('hotel', 'name')
        .sort('stayDetails.checkInDate')
        .limit(10)
        .select('bookingReference contactDetails.primaryGuest stayDetails hotel'),
      
      // Hotel performance
      HotelBooking.aggregate([
        { $match: { vendor: vendorId, bookingStatus: { $in: ['confirmed', 'checked_in', 'checked_out'] } } },
        {
          $group: {
            _id: '$hotel',
            bookingsCount: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.totalAmount' },
            averageBookingValue: { $avg: '$pricing.totalAmount' }
          }
        },
        { $sort: { bookingsCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'hotels',
            localField: '_id',
            foreignField: '_id',
            as: 'hotelInfo'
          }
        },
        { $unwind: '$hotelInfo' },
        {
          $project: {
            hotelName: '$hotelInfo.name',
            bookingsCount: 1,
            totalRevenue: 1,
            averageBookingValue: { $round: ['$averageBookingValue', 2] }
          }
        }
      ]),
      
      // Booking trends (last 30 days)
      HotelBooking.aggregate([
        {
          $match: {
            vendor: vendorId,
            createdAt: { $gte: last30Days }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
            },
            bookings: { $sum: 1 },
            revenue: { $sum: '$pricing.totalAmount' }
          }
        },
        { $sort: { '_id.date': 1 } },
        {
          $project: {
            date: '$_id.date',
            bookings: 1,
            revenue: 1,
            _id: 0
          }
        }
      ]),
      
      // Payment status breakdown
      HotelBooking.aggregate([
        { $match: { vendor: vendorId } },
        {
          $group: {
            _id: '$paymentDetails.paymentStatus',
            count: { $sum: 1 },
            totalAmount: { $sum: '$pricing.totalAmount' }
          }
        }
      ])
    ]);

    // Calculate growth rates
    const bookingGrowth = lastMonthBookings > 0 
      ? ((monthlyBookings - lastMonthBookings) / lastMonthBookings * 100).toFixed(1)
      : monthlyBookings > 0 ? 100 : 0;

    // Format revenue data
    const revenue = totalRevenue[0] ? totalRevenue[0].total : 0;
    const monthlyRev = monthlyRevenue[0] ? monthlyRevenue[0].total : 0;

    // Calculate average booking value
    const averageBookingValue = totalBookings > 0 ? (revenue / totalBookings).toFixed(2) : 0;

    // Calculate occupancy rate (simplified)
    const occupancyRate = activeHotels > 0 ? ((confirmedBookings / (activeHotels * 30)) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalHotels,
          activeHotels,
          pendingHotels,
          totalBookings,
          confirmedBookings,
          pendingBookings,
          totalRevenue: revenue,
          monthlyRevenue: monthlyRev,
          averageBookingValue: parseFloat(averageBookingValue),
          occupancyRate: parseFloat(occupancyRate)
        },
        trends: {
          monthlyBookings,
          lastMonthBookings,
          bookingGrowth: parseFloat(bookingGrowth),
          bookingTrends
        },
        hotelPerformance,
        recentBookings,
        upcomingCheckIns,
        paymentStatus
      }
    });
  } catch (error) {
    console.error('Get Vendor Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get vendor revenue analytics
// @route   GET /api/vendor/dashboard/revenue
// @access  Private/Vendor
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { period = 'month', year = new Date().getFullYear() } = req.query;

    let groupFormat, matchCondition;
    const targetYear = parseInt(year);

    switch (period) {
      case 'year':
        groupFormat = '%Y';
        matchCondition = {};
        break;
      case 'month':
        groupFormat = '%Y-%m';
        matchCondition = {
          createdAt: {
            $gte: new Date(targetYear, 0, 1),
            $lt: new Date(targetYear + 1, 0, 1)
          }
        };
        break;
      case 'day':
        groupFormat = '%Y-%m-%d';
        const currentMonth = new Date().getMonth();
        matchCondition = {
          createdAt: {
            $gte: new Date(targetYear, currentMonth, 1),
            $lt: new Date(targetYear, currentMonth + 1, 1)
          }
        };
        break;
      default:
        groupFormat = '%Y-%m';
        matchCondition = {
          createdAt: {
            $gte: new Date(targetYear, 0, 1),
            $lt: new Date(targetYear + 1, 0, 1)
          }
        };
    }

    const revenueData = await HotelBooking.aggregate([
      {
        $match: {
          vendor: vendorId,
          'paymentDetails.paymentStatus': 'completed',
          ...matchCondition
        }
      },
      {
        $group: {
          _id: {
            period: { $dateToString: { format: groupFormat, date: '$createdAt' } },
            hotel: '$hotel'
          },
          revenue: { $sum: '$pricing.totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'hotels',
          localField: '_id.hotel',
          foreignField: '_id',
          as: 'hotelInfo'
        }
      },
      { $unwind: '$hotelInfo' },
      {
        $group: {
          _id: '$_id.period',
          totalRevenue: { $sum: '$revenue' },
          totalBookings: { $sum: '$bookings' },
          hotelBreakdown: {
            $push: {
              hotelName: '$hotelInfo.name',
              revenue: '$revenue',
              bookings: '$bookings'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get comparison data (previous period)
    let comparisonMatch;
    if (period === 'month') {
      comparisonMatch = {
        createdAt: {
          $gte: new Date(targetYear - 1, 0, 1),
          $lt: new Date(targetYear, 0, 1)
        }
      };
    } else if (period === 'day') {
      const currentMonth = new Date().getMonth();
      comparisonMatch = {
        createdAt: {
          $gte: new Date(targetYear, currentMonth - 1, 1),
          $lt: new Date(targetYear, currentMonth, 1)
        }
      };
    }

    let comparisonData = [];
    if (comparisonMatch) {
      comparisonData = await HotelBooking.aggregate([
        {
          $match: {
            vendor: vendorId,
            'paymentDetails.paymentStatus': 'completed',
            ...comparisonMatch
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
            revenue: { $sum: '$pricing.totalAmount' },
            bookings: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    }

    res.status(200).json({
      success: true,
      data: {
        currentPeriod: revenueData,
        comparisonPeriod: comparisonData,
        period,
        year: targetYear
      }
    });
  } catch (error) {
    console.error('Get Revenue Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get vendor occupancy analytics
// @route   GET /api/vendor/dashboard/occupancy
// @access  Private/Vendor
exports.getOccupancyAnalytics = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { startDate, endDate } = req.query;

    // Default to current month if no dates provided
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Get hotel occupancy data
    const occupancyData = await HotelBooking.aggregate([
      {
        $match: {
          vendor: vendorId,
          bookingStatus: { $in: ['confirmed', 'checked_in', 'checked_out'] },
          $or: [
            {
              'stayDetails.checkInDate': { $gte: start, $lte: end }
            },
            {
              'stayDetails.checkOutDate': { $gte: start, $lte: end }
            },
            {
              $and: [
                { 'stayDetails.checkInDate': { $lte: start } },
                { 'stayDetails.checkOutDate': { $gte: end } }
              ]
            }
          ]
        }
      },
      {
        $group: {
          _id: '$hotel',
          totalBookings: { $sum: 1 },
          totalRooms: { $sum: '$roomDetails.numberOfRooms' },
          totalNights: { $sum: '$stayDetails.numberOfNights' },
          revenue: { $sum: '$pricing.totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'hotels',
          localField: '_id',
          foreignField: '_id',
          as: 'hotelInfo'
        }
      },
      { $unwind: '$hotelInfo' },
      {
        $project: {
          hotelName: '$hotelInfo.name',
          category: '$hotelInfo.category',
          totalBookings: 1,
          totalRooms: 1,
          totalNights: 1,
          revenue: 1,
          // Simple occupancy calculation (rooms booked / (days in period * estimated total rooms))
          occupancyRate: {
            $multiply: [
              {
                $divide: [
                  '$totalRooms',
                  {
                    $multiply: [
                      { $divide: [{ $subtract: [end, start] }, 86400000] }, // days in period
                      10 // estimated average rooms per hotel
                    ]
                  }
                ]
              },
              100
            ]
          }
        }
      },
      { $sort: { occupancyRate: -1 } }
    ]);

    // Get daily occupancy trends
    const dailyOccupancy = await HotelBooking.aggregate([
      {
        $match: {
          vendor: vendorId,
          bookingStatus: { $in: ['confirmed', 'checked_in', 'checked_out'] },
          'stayDetails.checkInDate': { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$stayDetails.checkInDate' } }
          },
          bookings: { $sum: 1 },
          rooms: { $sum: '$roomDetails.numberOfRooms' }
        }
      },
      { $sort: { '_id.date': 1 } },
      {
        $project: {
          date: '$_id.date',
          bookings: 1,
          rooms: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        hotelOccupancy: occupancyData,
        dailyTrends: dailyOccupancy,
        period: {
          startDate: start,
          endDate: end
        }
      }
    });
  } catch (error) {
    console.error('Get Occupancy Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};