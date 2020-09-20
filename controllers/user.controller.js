const {
  getAllusers,
  getUserById,
  deleteUser,
  updateMe,
  deleteMe,
  updateUser
} = require('../services/user.service');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((elem) => {
    if (allowFields.includes(elem)) newObj[elem] = obj[elem];
  });
  return newObj;
};

exports.getAllusers = factory.getAll(getAllusers);

exports.getUserById = factory.getOne(getUserById);

// Do not update passwords with this
exports.updateUser = factory.updateOne(updateUser);

exports.deleteUser = factory.deleteOne(deleteUser);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // 2) Filter body request to prevent updating role or others premium fields
  const filteredBody = filterObj(req.body, 'username', 'email');
  // 3) Update user document
  await updateMe(req.user, filteredBody, res);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await deleteMe(req, res);
});
