// // models/packageModel.js

// import mongoose from "mongoose";

// const packageSchema = new mongoose.Schema({
//   from: {
//     type: String,
//     required: true,
//   },
//   to: {
//     type: String,
//     required: true,
//   },
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   flightIncluded: {
//     type: Boolean,
//     required: true,
//   },
//   accommodationIncluded: {
//     type: Boolean,
//     default: false, // Default is false unless specified
//   },
//   logisticsIncluded: {
//     type: Boolean,
//     default: false, // Default is false unless specified
//   },
//   checkInDate: {
//     type: Date,
//     required: true,
//   },
//   checkOutDate: {
//     type: Date,
//     required: true,
//   },
//   packageType: {
//     type: String,
//     enum: ['standard', 'premium', 'luxury'], // This can be useful for categorizing the packages
//     default: 'standard', // Default type is standard unless specified
//   },
//   availableSeats: {
//     type: Number,
//     default: 0, // Number of available seats for booking
//   },
// });

// export default mongoose.model("Package", packageSchema);


// models/packageModel.js

import { Schema, model } from "mongoose";

const packageSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  destination: { type: String, required: true } 
});

const Package = model("Package", packageSchema);

export default Package;
