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
  const tour = await getTourById(req.params.id);
  return res.status(200).json({
    status: 'success',
    data: {
      tour
    },
    message: 'Successfully fetched tour'
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  //TODO check params validation
  const tour = await createTour(req.body);
  return res.status(201).json({
    status: 'success',
    data: {
      tour
    },
    message: 'Tour created'
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await updateTour(req.params.id, req.body);
  return res.status(200).json({
    status: 'success',
    data: {
      tour
    },
    message: 'Tour updated'
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await deleteTour(req.params.id);
  return res.status(204).json({
    status: 'success',
    data: {
      data: null
    },
    message: 'Tour deleted'
  });
});

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
