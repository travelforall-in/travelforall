const CustomPackage = require("../models/CustomPackage");
const mongoose = require("mongoose");

// @desc    Create custom package request
// @route   POST /api/custom-packages
// @access  Private
exports.createCustomPackage = async (req, res) => {
  try {
    const {
      name,
      destination,
      startDate,
      endDate,
      accommodation,
      transportation,
      meals,
      activities,
      budget,
      travelers,
      specialRequests,
    } = req.body;

    // Create custom package
    const customPackage = await CustomPackage.create({
      user: req.user._id,
      name,
      destination,
      startDate,
      endDate,
      accommodation,
      transportation,
      meals,
      activities,
      budget,
      travelers,
      specialRequests,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: customPackage,
    });
  } catch (error) {
    console.error("Create Custom Package Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get custom package by ID
// @route   GET /api/custom-packages/:id
// @access  Private
exports.getCustomPackage = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid custom package ID",
      });
    }

    const customPackage = await CustomPackage.findById(req.params.id);

    if (!customPackage) {
      return res.status(404).json({
        success: false,
        message: "Custom package not found",
      });
    }

    // Check if user is owner of the package or an admin
    if (
      customPackage.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this custom package",
      });
    }

    res.status(200).json({
      success: true,
      data: customPackage,
    });
  } catch (error) {
    console.error("Get Custom Package Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update custom package
// @route   PUT /api/custom-packages/:id
// @access  Private
exports.updateCustomPackage = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid custom package ID",
      });
    }

    let customPackage = await CustomPackage.findById(req.params.id);

    if (!customPackage) {
      return res.status(404).json({
        success: false,
        message: "Custom package not found",
      });
    }

    // Check if user is owner of the package
    if (customPackage.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this custom package",
      });
    }

    // Check if package is already confirmed or cancelled
    if (["confirmed", "cancelled"].includes(customPackage.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update a ${customPackage.status} package`,
      });
    }

    // Update package
    customPackage = await CustomPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: customPackage,
    });
  } catch (error) {
    console.error("Update Custom Package Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Cancel custom package
// @route   PUT /api/custom-packages/:id/cancel
// @access  Private
exports.cancelCustomPackage = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid custom package ID",
      });
    }

    let customPackage = await CustomPackage.findById(req.params.id);

    if (!customPackage) {
      return res.status(404).json({
        success: false,
        message: "Custom package not found",
      });
    }

    // Check if user is owner of the package
    if (customPackage.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to cancel this custom package",
      });
    }

    // Check if package is already cancelled
    if (customPackage.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Package is already cancelled",
      });
    }

    // Update status to cancelled
    customPackage = await CustomPackage.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: customPackage,
    });
  } catch (error) {
    console.error("Cancel Custom Package Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get user custom packages
// @route   GET /api/custom-packages/user
// @access  Private
exports.getUserCustomPackages = async (req, res) => {
  try {
    console.log("req.user._id", req.user._id);
    const customPackages = await CustomPackage.find({
      user: req.user._id,
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: customPackages.length,
      data: customPackages,
    });
  } catch (error) {
    console.error("Get User Custom Packages Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
