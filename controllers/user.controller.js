const {
  getAllusers,
  getUserById,
  deleteUser,
  updateMe,
  deleteMe
} = require('../services/user.service');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((elem) => {
    if (allowFields.includes(elem)) newObj[elem] = obj[elem];
  });
  return newObj;
};

exports.getAllusers = catchAsync(async (req, res, next) => {
  const users = await getAllusers(next);
  return res.status(200).json({
    status: 'success',
    data: {
      users
    },
    message: 'Succesfully fetching users'
  });
});

exports.getUserById = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: {
        user
      },
      message: 'Successfully fetching users'
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err
    });
  }
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

exports.deleteUser = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    return res.status(204).json({
      status: 'success',
      data: {
        data: null
      },
      message: 'User deleted'
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};
