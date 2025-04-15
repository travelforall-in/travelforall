// models/packageModel.js

import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  from: String,
  to: String,
  title: String,
  description: String,
  price: Number,
  image: String,
  flightIncluded: Boolean,
});

export default mongoose.model("Package", packageSchema);
