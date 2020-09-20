const catchAsync = require('../utils/catchAsync');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview
} = require('../services/review.service');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }
  const reviews = await getAllReviews(filter);
  return res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    },
    message: 'Succesfully fetched reviews'
  });
});

exports.createReview = factory.createOne(createReview);

exports.updateReview = factory.updateOne(updateReview);

exports.deleteReview = factory.deleteOne(deleteReview);
