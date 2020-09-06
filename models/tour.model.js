const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a product must have an name'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'a product must have an duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'a product must have a maxgroupSize']
  },
  difficulty: {
    type: String,
    required: [true, 'a product must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'a product must have a price']
  },
  priceDiscount: {
    type: Number
  },
  summary: {
    type: String,
    required: [true, 'a product must have a summary'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'a product must have a description'],
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A product must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
