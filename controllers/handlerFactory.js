const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
