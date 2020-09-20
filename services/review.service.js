const AppError = require('../utils/appError');
const Review = require('../models/review.model');
const factory = require('../controllers/handlerFactory');

exports.getAllReviews = async (filter) => {
  try {
    const reviews = Review.find(filter).select('-__v');
    return reviews;
  } catch (error) {
    throw Error({ error });
  }
};

exports.createReview = async (args, next) => {
  try {
    const newReview = await Review.create(args);
    return newReview;
  } catch (error) {
    return next(new AppError(`Error while creating Review: ${error}`, 404));
  }
};

exports.updateReview = async (id, body, next) => {
  return factory.updateOneInService(Review, id, body, next);
};

exports.deleteReview = async (id, next) => {
  return factory.deleteOneInService(Review, id, next);
};
