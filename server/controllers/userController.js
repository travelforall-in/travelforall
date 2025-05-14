
// import User from '../models/User.js';
 const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// // @desc    Update user profile
// // @route   PUT /api/users/profile
// // @access  Private
// exports.updateUserProfile = async (req, res) => {
//   try {
//     const updatedFields = {};

//     // Only allow specific fields to be updated
//     if (req.body.name) updatedFields.name = req.body.name;
//     if (req.body.email) updatedFields.email = req.body.email;
//     if (req.body.phone) updatedFields.phone = req.body.phone;
    
//     // Update password if provided
//     if (req.body.password) {
//       // Get user with password
//       const user = await User.findById(req.user._id).select('+password');
      
//       // Check if current password matches
//       if (req.body.currentPassword) {
//         const isMatch = await user.matchPassword(req.body.currentPassword);
        
//         if (!isMatch) {
//           return res.status(401).json({
//             success: false,
//             message: 'Current password is incorrect',
//           });
//         }
        
        
//         // Set new password
//         user.password = req.body.password;
//         await user.save();
//       } else {
//         return res.status(400).json({
//           success: false,
//           message: 'Current password is required',
//         });
//       }
//     }

//     // Update user with non-password fields
//     if (Object.keys(updatedFields).length > 0) {
//       const user = await User.findByIdAndUpdate(
//         req.user._id,
//         updatedFields,
//         {
//           new: true,
//           runValidators: true,
//         }
//       ).select('-password');

//       res.status(200).json({
//         success: true,
//         data: user,
//       });
//     } else if (!req.body.password) {
//       // If no fields were updated and no password change
//       res.status(400).json({
//         success: false,
//         message: 'No update data provided',
//       });
//     } else {
//       // If only password was changed
//       const user = await User.findById(req.user._id).select('-password');
      
//       res.status(200).json({
//         success: true,
//         data: user,
//       });
//     }
//   } catch (error) {
//     console.error('Update User Profile Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// update user profile(name, email, phone)
exports.updateUserDetails = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updatedFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update User Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// @desc    Change user password
// @route   PUT /api/users/profile/change-password
// @access  Private
exports.changeUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};



// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updateUserPreferences = async (req, res) => {
  try {
    const {
      preferredDestinations,
      preferredActivities,
      preferredAccommodations,
      budgetRange,
      travelStyle,
      transportPreferences,
      diningPreferences,
      specialRequirements
    } = req.body;

    // Prepare preferences object
    const preferences = {};

    // Update only provided fields
    if (preferredDestinations) preferences.preferredDestinations = preferredDestinations;
    if (preferredActivities) preferences.preferredActivities = preferredActivities;
    if (preferredAccommodations) preferences.preferredAccommodations = preferredAccommodations;
    if (budgetRange) preferences.budgetRange = budgetRange;
    if (travelStyle) preferences.travelStyle = travelStyle;
    if (transportPreferences) preferences.transportPreferences = transportPreferences;
    if (diningPreferences) preferences.diningPreferences = diningPreferences;
    if (specialRequirements) preferences.specialRequirements = specialRequirements;

    // Update user preferences
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { preferences } },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update User Preferences Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user preferences
// @route   GET /api/users/preferences
// @access  Private
exports.getUserPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('preferences')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.preferences || {}
    });
  } catch (error) {
    console.error('Get User Preferences Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};