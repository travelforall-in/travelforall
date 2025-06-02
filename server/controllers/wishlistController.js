// const Wishlist = require('../models/Wishlist');
// const Package = require('../models/Package');
// const mongoose = require('mongoose');

// // @desc    Add package to wishlist
// // @route   POST /api/wishlist/:id
// // @access  Private
// exports.addToWishlist = async (req, res) => {
//   try {
//     const packageId = req.params.id;
    
//     // Validate package ID
//     if (!mongoose.Types.ObjectId.isValid(packageId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid package ID'
//       });
//     }
    
//     // Validate package exists
//     const packageExists = await Package.findById(packageId);
//     if (!packageExists) {
//       return res.status(404).json({
//         success: false,
//         message: 'Package not found'
//       });
//     }

//     // Find user's wishlist or create if doesn't exist
//     let wishlist = await Wishlist.findOne({ user: req.user._id });
    
//     if (!wishlist) {
//       wishlist = await Wishlist.create({
//         user: req.user._id,
//         packages: [packageId]
//       });
//     } else {
//       // Check if package already in wishlist
//       if (wishlist.packages.includes(packageId)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Package already in wishlist'
//         });
//       }
      
//       // Add to wishlist
//       wishlist.packages.push(packageId);
//       await wishlist.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Package added to wishlist',
//       data: wishlist
//     });
//   } catch (error) {
//     console.error('Add to Wishlist Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // @desc    Get user's wishlist
// // @route   GET /api/wishlist
// // @access  Private
// exports.getWishlist = async (req, res) => {
//   try {
//     // Find user's wishlist
//     const wishlist = await Wishlist.findOne({ user: req.user._id })
//       .populate('packages', 'name type destination price duration images averageRating');

//     // If no wishlist found, return empty array
//     if (!wishlist) {
//       return res.status(200).json({
//         success: true,
//         count: 0,
//         data: []
//       });
//     }

//     res.status(200).json({
//       success: true,
//       count: wishlist.packages.length,
//       data: wishlist.packages
//     });
//   } catch (error) {
//     console.error('Get Wishlist Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // @desc    Remove package from wishlist
// // @route   DELETE /api/wishlist/:id
// // @access  Private
// exports.removeFromWishlist = async (req, res) => {
//   try {
//     const packageId = req.params.id;
    
//     // Validate package ID
//     if (!mongoose.Types.ObjectId.isValid(packageId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid package ID'
//       });
//     }
    
//     // Find user's wishlist
//     const wishlist = await Wishlist.findOne({ user: req.user._id });
    
//     if (!wishlist) {
//       return res.status(404).json({
//         success: false,
//         message: 'Wishlist not found'
//       });
//     }
    
//     // Check if package in wishlist
//     const packageIndex = wishlist.packages.findIndex(
//       id => id.toString() === packageId
//     );
    
//     if (packageIndex === -1) {
//       return res.status(400).json({
//         success: false,
//         message: 'Package not in wishlist'
//       });
//     }
    
//     // Remove from wishlist
//     wishlist.packages.splice(packageIndex, 1);
//     await wishlist.save();
    
//     res.status(200).json({
//       success: true,
//       message: 'Package removed from wishlist',
//       data: wishlist
//     });
//   } catch (error) {
//     console.error('Remove from Wishlist Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };






// const Wishlist = require('../models/Wishlist');
// const Package = require('../models/Package');
// const mongoose = require('mongoose');

// // Add to Wishlist
// exports.addToWishlist = async (req, res) => {
//   try {
//     const { userId, packageId } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(packageId)) {
//       return res.status(400).json({ success: false, message: 'Invalid package ID' });
//     }

//     const packageExists = await Package.findById(packageId);
//     if (!packageExists) {
//       return res.status(404).json({ success: false, message: 'Package not found' });
//     }

//     let wishlist = await Wishlist.findOne({ user: userId });

//     if (!wishlist) {
//       wishlist = await Wishlist.create({
//         user: userId,
//         packages: [packageId]
//       });
//     } else {
//       if (wishlist.packages.includes(packageId)) {
//         return res.status(400).json({ success: false, message: 'Already in wishlist' });
//       }
//       wishlist.packages.push(packageId);
//       await wishlist.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Added to wishlist',
//       data: wishlist
//     });
//   } catch (error) {
//     console.error('Add to Wishlist Error:', error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// // Get Wishlist
// exports.getWishlist = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const wishlist = await Wishlist.findOne({ user: userId }).populate(
//       'packages',
//       'name destination price duration images averageRating'
//     );

//     if (!wishlist) {
//       return res.status(200).json([]);
//     }

//     res.status(200).json(wishlist.packages);
//   } catch (error) {
//     console.error('Get Wishlist Error:', error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// // Remove from Wishlist
// exports.removeFromWishlist = async (req, res) => {
//   try {
//     const packageId = req.params.packageId;
//     const { userId } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(packageId)) {
//       return res.status(400).json({ success: false, message: 'Invalid package ID' });
//     }

//     const wishlist = await Wishlist.findOne({ user: userId });
//     if (!wishlist) {
//       return res.status(404).json({ success: false, message: 'Wishlist not found' });
//     }

//     const index = wishlist.packages.findIndex(
//       id => id.toString() === packageId
//     );

//     if (index === -1) {
//       return res.status(400).json({ success: false, message: 'Package not in wishlist' });
//     }

//     wishlist.packages.splice(index, 1);
//     await wishlist.save();

//     res.status(200).json({ success: true, message: 'Removed from wishlist', data: wishlist });
//   } catch (error) {
//     console.error('Remove from Wishlist Error:', error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };






const Wishlist = require('../models/Wishlist');
const Package = require('../models/Package');
const mongoose = require('mongoose');

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.params.id; // <-- FIXED
    const { packageId } = req.body;
    
    

    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({ success: false, message: 'Invalid package ID' });
    }

    const packageExists = await Package.findById(packageId);
    if (!packageExists) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        packages: [packageId],
      });
    } else {
      if (wishlist.packages.includes(packageId)) {
        return res.status(400).json({ success: false, message: 'Already in wishlist' });
      }
      wishlist.packages.push(packageId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Added to wishlist',
      data: wishlist,
    });
  } catch (error) {
    console.error('Add to Wishlist Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


// get wishlist
// exports.getWishlist = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const wishlist = await Wishlist.findOne({ user: userId }).populate('packages', 'name destination price duration images averageRating');
//     if (!wishlist) return res.status(200).json([]);
//     res.status(200).json({ packages: wishlist.packages });
//   } catch (error) {
//     console.error('Get Wishlist Error:', error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.query.userId; // Use query param instead of req.params

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(200).json({ packages: [] });
    }

    const packageIds = wishlist.packages.map((id) => ({
      packageId: id.toString(),
    }));

    res.status(200).json({ packages: packageIds });
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};




// remove
exports.removeFromWishlist = async (req, res) => {
  try {
   const packageId = req.params.id;;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({ success: false, message: 'Invalid package ID' });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    const index = wishlist.packages.findIndex(id => id.toString() === packageId);
    if (index === -1) {
      return res.status(400).json({ success: false, message: 'Package not in wishlist' });
    }

    wishlist.packages.splice(index, 1);
    await wishlist.save();

    res.status(200).json({ success: true, message: 'Removed from wishlist', data: wishlist });
  } catch (error) {
    console.error('Remove from Wishlist Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
