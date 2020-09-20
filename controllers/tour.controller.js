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
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(getAllTours);

exports.getTourById = factory.getOne(getTourById);

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
