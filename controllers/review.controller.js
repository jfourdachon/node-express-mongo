const catchAsync = require('../utils/catchAsync');
const { getAllReviews, createReview } = require('../services/review.service');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await getAllReviews();
  return res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    },
    message: 'Succesfully fetched reviews'
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await createReview(req.body, next);
  return res.status(201).json({
    status: 'success',
    data: {
      review
    },
    message: 'Review created'
  });
});
