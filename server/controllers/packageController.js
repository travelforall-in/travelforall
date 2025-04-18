import Package from '../models/packageModel.js';

export const search = async (req, res) => {
  try {
    const { destination, checkIn, checkOut } = req.query;
    console.log('Search parameters:', { destination, checkIn, checkOut });

    // Validate destination
    if (!destination) {
      return res.status(400).json({ message: "Destination is required." });
    }

    // Create base query for destination search
    const query = {
      $or: [
        { destination: new RegExp(destination, "i") }, // Added this line
        // { from: new RegExp(destination, "i") },x`
        // { to: new RegExp(destination, "i") },
        { location: new RegExp(destination, "i") }
      ]
    };

    // Add date filters dynamically if provided
    if (checkIn || checkOut) {
      query.dateRange = {
        ...(checkIn && { startDate: { $gte: new Date(checkIn) } }),
        ...(checkOut && { endDate: { $lte: new Date(checkOut) } })
      };
    }

    console.log('Executing query:', JSON.stringify(query, null, 2)); // Debug log
    const packages = await Package.find(query);
    console.log('Found packages:', packages.length); // Debug log

    res.json({
      success: true,
      count: packages.length,
      data: packages,
      destination // Include the searched destination in response
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

export const packages = async (req, res) => {
  try {
    const { destination } = req.query;
    let query = {};

    // Add destination filter if provided
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    const packages = await Package.find(query);
    
    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
      ...(destination && { destination }) // Include destination in response if searched
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching packages',
      error: error.message 
    });
  }
};