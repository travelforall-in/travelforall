const Testimonial = require('../models/Testimonial');
const path = require('path');
const fs = require('fs');

const submitTestimonial = async (req, res, next) => {
  try {
    console.log('Received body:', req.body);
    console.log('Received file:', req.file); // Add this line

    
    const { name, location, rating, testimonial } = req.body;
    const image = req.file?.filename;

    if (!name || !location || !rating || !testimonial || !image) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const newEntry = new Testimonial({ name, location, rating, testimonial, image });
    await newEntry.save();

    res.status(201).json({ message: 'Testimonial submitted successfully' });
  } catch (error) {
    next(error);
  }
};

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
};


module.exports = { submitTestimonial, getTestimonials };

