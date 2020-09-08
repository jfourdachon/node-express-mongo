const APIFeatures = require('../utils/apiFeatures');
const Tour = require('../models/tour.model');

exports.createTour = async (args) => {
  try {
    const newTour = await Tour.create(args);
    return newTour;
  } catch (error) {
    throw Error(`Error while creating Tour: ${error}`);
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
exports.getTourById = async (id) => {
  try {
    const user = await Tour.findById(id);
    return user;
  } catch (error) {
    throw Error(`Tour with id: ${id} has not been found`);
  }
};

exports.updateTour = async (id, body) => {
  try {
    const user = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true // validators from schema
    });
    return user;
  } catch (error) {
    throw Error(`Error while updating tour: ${error}`);
  }
};

exports.deleteTour = async (id) => {
  try {
    await Tour.findOneAndDelete({ _id: id });
  } catch (err) {
    throw Error(`Error while deleting tour: ${err}`);
  }
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
