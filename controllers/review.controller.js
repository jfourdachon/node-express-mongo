const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getReviewById
} = require('../services/review.service');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(getAllReviews);

exports.getReviewById = factory.getOne(getReviewById);

exports.createReview = factory.createOne(createReview);

exports.updateReview = factory.updateOne(updateReview);

exports.deleteReview = factory.deleteOne(deleteReview);
