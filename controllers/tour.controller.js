const Tour = require('../models/tour.model');
const {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  aggregateTour,
  getMonthlyPlan
} = require('../services/tour.service');
const AppError = require('../utils/appError');
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

// /tours-within/:distance/center/:latlng/unit/:unit
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  console.log({ distance, lat, lng, unit, radius });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});
