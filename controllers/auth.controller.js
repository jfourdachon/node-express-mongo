const crypto = require('crypto');
const User = require('../models/user.model');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('../services/auth.service');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.signup = async (req, res, next) => {
  //TODO check params validation
  try {
    const foundedUser = await User.findOne({ email: req.body.email });
    if (foundedUser) {
      return res
        .status(200)
        .json({ status: 400, message: 'User found', type: 'already-found' });
    }
    await signup(req.body, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }
  // 3) if everything is ok, send token to client
  await login(user, res, next);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user on posted email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }
  const forgottenPassword = await forgotPassword(user, req, res, next);

  return forgottenPassword;
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  // 2) if token has not expired, and there is user, set the new password
  const resetedPassword = await resetPassword(user, req, res);

  return resetedPassword;
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return next(new AppError('User has not been found.', 404));
  }

  // 2) Check if current password is correct
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('Your current password is incorrect', 401));
  }
  // 3) Update password and send jwt to client
  await updatePassword(user, req, res);
});
