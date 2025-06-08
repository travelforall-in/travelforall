// controllers/vendorAuthController.js
const VendorAdmin = require('../models/VendorAdmin');
const { sendTokenResponse } = require('../utils/jwtToken');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// @desc    Register vendor
// @route   POST /api/vendor/auth/register
// @access  Public
exports.registerVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      vendorDetails
    } = req.body;

    // Check if vendor already exists
    const vendorExists = await VendorAdmin.findOne({ email });

    if (vendorExists) {
      return res.status(400).json({
        success: false,
        message: 'Vendor already exists with this email'
      });
    }

    // Create vendor
    const vendor = await VendorAdmin.create({
      name,
      email,
      password,
      phone,
      vendorDetails,
      status: 'pending' // Requires admin approval
    });

    // Send response without token (vendor needs approval first)
    res.status(201).json({
      success: true,
      message: 'Vendor registration successful. Awaiting admin approval.',
      data: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        status: vendor.status
      }
    });
  } catch (error) {
    console.error('Vendor Registration Error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Vendor already exists with this email'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during vendor registration',
      error: error.message
    });
  }
};

// @desc    Login vendor
// @route   POST /api/vendor/auth/login
// @access  Public
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for vendor with password included
    const vendor = await VendorAdmin.findOne({ email }).select('+password');

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if vendor is approved and active
    if (vendor.status === 'pending') {
      return res.status(401).json({
        success: false,
        message: 'Your account is pending approval. Please contact admin.'
      });
    }

    if (vendor.status === 'inactive') {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.'
      });
    }

    if (vendor.status === 'suspended') {
      return res.status(401).json({
        success: false,
        message: 'Your account has been suspended. Please contact admin.'
      });
    }

    // Check if password matches
    const isMatch = await vendor.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await vendor.updateLastLogin();

    // Send token response
    sendTokenResponse(vendor, 200, res);
  } catch (error) {
    console.error('Vendor Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Get current logged in vendor
// @route   GET /api/vendor/auth/me
// @access  Private/Vendor
exports.getMe = async (req, res) => {
  try {
    const vendor = req.vendor;

    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Get Vendor Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update vendor profile
// @route   PUT /api/vendor/auth/profile
// @access  Private/Vendor
exports.updateProfile = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const {
      name,
      phone,
      vendorDetails
    } = req.body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (vendorDetails) updateData.vendorDetails = { ...req.vendor.vendorDetails, ...vendorDetails };

    // Update vendor
    const vendor = await VendorAdmin.findByIdAndUpdate(
      vendorId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Update Vendor Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Change vendor password
// @route   PUT /api/vendor/auth/change-password
// @access  Private/Vendor
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    // Get vendor with password
    const vendor = await VendorAdmin.findById(req.vendor._id).select('+password');

    // Check current password
    const isMatch = await vendor.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    vendor.password = newPassword;
    await vendor.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
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

// @desc    Logout vendor
// @route   POST /api/vendor/auth/logout
// @access  Private/Vendor
exports.logout = async (req, res) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Vendor logged out successfully'
    });
  } catch (error) {
    console.error('Vendor Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};