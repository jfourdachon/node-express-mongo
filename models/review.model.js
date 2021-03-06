const mongoose = require('mongoose');
const Tour = require('./tour.model');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now(),
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

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // cacluate tours reviews with aggregate
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nbRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // Save stats to tour collection
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nbRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

// Unique review per tour and user
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Post middleware doesn't have access to next function
reviewSchema.post('save', function () {
  // this points to current review
  // this.constructor = Review model
  this.constructor.calcAverageRatings(this.tour);
});

// Recalculate ratings stats after update and delete
// FincByIdAndUpdate
// FincByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); DOES NOT work here, query hqs qlready executed
  await this.review.constructor.calcAverageRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
