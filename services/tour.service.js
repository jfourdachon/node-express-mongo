const Tour = require('../models/tour.model');
const factory = require('../controllers/handlerFactory');

exports.createTour = async (args, next) =>
  factory.createOneInService(Tour, args, next);

exports.getAllTours = async (params, next) =>
  factory.getAllInService(Tour, params, next);

exports.getTourById = async (id, next) =>
  factory.getOneInService(Tour, id, { path: 'reviews' }, next);

exports.updateTour = async (id, body, next) =>
  factory.updateOneInService(Tour, id, body, next);

exports.deleteTour = async (id, next) =>
  factory.deleteOneInService(Tour, id, next);

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
