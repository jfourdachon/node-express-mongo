const APIFeatures = require('../utils/apiFeatures');
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

/***************************************
 * ******  GET FACTORY
 ***************************************/

exports.getOne = (Service) =>
  catchAsync(async (req, res, next) => {
    // TODO make a better express errors handling
    const doc = await Service(req.params.id, next);
    if (!doc) {
      return next(new AppError('No document was found with this ID!', 404));
    }
    return res.status(200).json({
      status: 'success',
      data: {
        data: doc
      },
      message: 'Successfully fetched document'
    });
  });

exports.getOneInService = async (Model, id, popOptions, next) => {
  try {
    let query = Model.findById(id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    return doc;
  } catch (error) {
    return next(new AppError('No document was found with this ID!', 404));
  }
};

exports.getAll = (Service) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested Get reviews on tour (hack)
    let filter;
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }
    const docs = await Service(req.query, next, filter);
    return res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        data: docs
      },
      message: 'Succesfully fetched documents'
    });
  });

exports.getAllInService = async (Model, params, next, filter) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), params)
      .filter()
      .sort()
      .limitFields();
    // .paginate();
    // const docs = await features.query.explain();  // UseFul to see indexes benefits
    const docs = await features.query;

    //SEND RESPONSE
    return docs;
  } catch (error) {
    return next(new AppError('Documents has not been found', 404));
  }
};
