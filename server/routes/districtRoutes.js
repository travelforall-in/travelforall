import express from "express";
import District from "../models/District.js";
import { district, searchPlaces } from "../controllers/districtController.js";

const router = express.Router();

// Get all districts
router.get("/district", district)
router.get("/search-places", searchPlaces)

// (Optional) Add a new district
router.post("/", async (req, res) => {
  try {
    const district = new District({ name: req.body.name });
    const saved = await district.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
