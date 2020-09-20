const Review = require('../models/review.model');
const factory = require('../controllers/handlerFactory');

exports.getAllReviews = async (params, next, filter) =>
  factory.getAllInService(Review, params, next, filter);

exports.getReviewById = async (id, next) =>
  factory.getOneInService(Review, id, null, next);

exports.createReview = async (args, next) =>
  factory.createOneInService(Review, args, next);

exports.updateReview = async (id, body, next) =>
  factory.updateOneInService(Review, id, body, next);

exports.deleteReview = async (id, next) =>
  factory.deleteOneInService(Review, id, next);
