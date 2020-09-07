const {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  aggregateTour,
  getMonthlyPlan
} = require('../services/tour.service');

exports.aliasTopTours = (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const tours = await getAllTours(req.query);
    return res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours
      },
      message: 'Succesfully fetched tours'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await getTourById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: {
        tour
      },
      message: 'Successfully fetched tour'
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  //TODO check params validation
  try {
    const tour = await createTour(req.body);
    return res.status(201).json({
      status: 'success',
      data: {
        tour
      },
      message: 'Tour created'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await updateTour(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: {
        tour
      },
      message: 'Tour updated'
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await deleteTour(req.params.id);
    return res.status(204).json({
      status: 'success',
      data: {
        data: null
      },
      message: 'Tour deleted'
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getTourStats = async (_, res) => {
  try {
    const stats = await aggregateTour();
    return res.status(200).json({
      status: 'success',
      data: {
        data: stats
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const plan = await getMonthlyPlan(req.params);
    return res.status(200).json({
      status: 'success',
      data: {
        data: plan
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
