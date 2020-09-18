const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    raring: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      defult: Date.now(),
      select: false
    },
    // References
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    }
  },
  // add virtuals to schema (Cannot being queried!!!)
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function (next) {
  // commented because redundant reviews in tour in review...
  // this.populate({
  //   path: 'user',
  //   select: 'username photo'
  // }).populate({
  //   path: 'tour',
  //   select: 'name'
  // });
  this.populate({
    path: 'user',
    select: 'username photo'
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
