const APIFeatures = require('../utils/apiFeatures');
const Tour = require('../models/tour.model');
const AppError = require('../utils/appError');
const { deleteOneInService } = require('../controllers/handlerFactory');

exports.createTour = async (args, next) => {
  try {
    const newTour = await Tour.create(args);
    return newTour;
  } catch (error) {
    return next(new AppError(`Error while creating Tour: ${error}`, 404));
  }
};

exports.getAllTours = async (params) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), params)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    //SEND RESPONSE
    return tours;
  } catch (error) {
    throw Error(`Error while getting tours: ${error}`);
  }
};
exports.getTourById = async (id, next) => {
  try {
    const tour = await Tour.findById(id).populate('reviews');
    return tour;
  } catch (error) {
    return next(new AppError('No tour was found with this ID!', 404));
  }
};

exports.updateTour = async (id, body, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true // validators from schema
    });
    return tour;
  } catch (error) {
    return next(new AppError(error.message, 404));
  }
};

exports.deleteTour = async (id, next) => {
  return deleteOneInService(Tour, id, next);
};

exports.aggregateTour = async () => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numOfRatings: { $sum: '$ratingsQuantity' },
          numOfTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: {
          avgPrice: 1 // -1 for descendant sort
        }
      }
      // {
      //   $match: {
      //     _id: { $ne: 'EASY' },
      //   },
      // },
    ]);
    return stats;
  } catch (error) {
    throw Error(`Error while aggregate tour: ${error}`);
  }
};

exports.getMonthlyPlan = async (req) => {
  try {
    const year = req.year * 1;
    const plan = await Tour.aggregate([
      {
        // create one object by startDate
        $unwind: '$startDates'
      },
      {
        // match dates
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        // group by
        $group: {
          _id: { $month: '$startDates' },
          numOfToursStars: { $sum: 1 },
          // create an array and puch tour name
          tours: { $push: '$name' }
        }
      },
      {
        // add custom field
        $addFields: {
          month: '$_id'
        }
      },
      {
        $sort: {
          // descendant sort
          numOfToursStars: -1
        }
      },
      {
        // hide field
        $project: {
          _id: 0
        }
      },
      {
        // limit results
        $limit: 12
      }
    ]);
    return plan;
  } catch (error) {
    throw Error(`Error while aggregate plan: ${error}`);
  }
};
