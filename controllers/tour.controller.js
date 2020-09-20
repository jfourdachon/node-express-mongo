const {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  aggregateTour,
  getMonthlyPlan
} = require('../services/tour.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const tours = await getAllTours(req.query);

  return res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours
    },
    message: 'Succesfully fetched tours'
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  // TODO make a better express errors handling
  const tour = await getTourById(req.params.id, next);
  if (!tour) {
    return next(new AppError('No tour was found with this ID!', 404));
  }
  return res.status(200).json({
    status: 'success',
    data: {
      tour
    },
    message: 'Successfully fetched tour'
  });
});

exports.createTour = factory.createOne(createTour);

exports.updateTour = factory.updateOne(updateTour);

exports.deleteTour = factory.deleteOne(deleteTour);

exports.getTourStats = catchAsync(async (_, res, next) => {
  const stats = await aggregateTour();
  return res.status(200).json({
    status: 'success',
    data: {
      data: stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const plan = await getMonthlyPlan(req.params);
  return res.status(200).json({
    status: 'success',
    data: {
      data: plan
    }
  });
});
