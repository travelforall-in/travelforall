const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true },
  testimonial: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
