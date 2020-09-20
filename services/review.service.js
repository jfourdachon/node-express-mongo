const AppError = require('../utils/appError');
const Review = require('../models/review.model');
const { deleteOneInService } = require('../controllers/handlerFactory');

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

exports.deleteReview = async (id, next) => {
  return deleteOneInService(Review, id, next);
};
