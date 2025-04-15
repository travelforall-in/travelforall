// controllers/packageController.js
import Package from '../models/packageModel.js';

export const search = async (req, res) => {
  try {
    const { from, to } = req.query;
    console.log('from',from)
    console.log('to ',to )

    if (!from || !to) {
      return res.status(400).json({ message: "From and To are required." });
    }

    const packages = await Package.find({
      from: new RegExp(from, "i"),
      to: new RegExp(to, "i"),
    });

    res.json(packages);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};