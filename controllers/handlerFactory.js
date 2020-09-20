const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/***************************************
 * ******  DELETE FACTORY
 ***************************************/
exports.deleteOne = (Service) =>
  catchAsync(async (req, res, next) => {
    const doc = await Service(req.params.id, next);
    if (!doc) {
      return next(new AppError('No document was found with this ID!', 404));
    }
    return res.status(204).json({
      status: 'success',
      data: {
        data: null
      },
      message: 'Document deleted'
    });
  });

exports.deleteOneInService = async (Model, id, next) => {
  try {
    const tour = await Model.findOneAndDelete({ _id: id });
    return tour;
  } catch (err) {
    return next(new AppError(err.message, 404));
  }
};

/***************************************
 * ******  UPDATE FACTORY
 ***************************************/
exports.updateOne = (Service) =>
  catchAsync(async (req, res, next) => {
    const doc = await Service(req.params.id, req.body, next);

    return res.status(200).json({
      status: 'success',
      data: {
        data: doc
      },
      message: 'Document updated'
    });
  });

exports.updateOneInService = async (Model, id, body, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true // validators from schema
    });
    return doc;
  } catch (error) {
    return next(new AppError(error.message, 404));
  }
};

/***************************************
 * ******  CREATE FACTORY
 ***************************************/

exports.createOne = (Service) =>
  catchAsync(async (req, res, next) => {
    const doc = await Service(req.body, next);
    return res.status(201).json({
      status: 'success',
      data: {
        doc
      },
      message: 'Document created'
    });
  });

exports.createOneInService = async (Model, args, next) => {
  try {
    const newDoc = await Model.create(args);
    return newDoc;
  } catch (error) {
    return next(new AppError(`Error while creating Doc: ${error}`, 404));
  }
};
