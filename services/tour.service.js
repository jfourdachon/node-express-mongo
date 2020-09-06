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
      runValidators: true
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
