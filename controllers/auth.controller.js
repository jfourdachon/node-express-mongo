const User = require('../models/user.model');
const { signup, login, forgotPassword } = require('../services/user.service');
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
    const result = await signup(req.body);
    return res.status(201).json({
      status: 'success',
      token: result.token,
      data: {
        user: result.newUser
      },
      message: 'User created'
    });
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
  await login(user.id, res, next);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user on posted email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }
  await forgotPassword(user, req, res, next);
});

exports.resetPassword = (req, res, next) => {
  // 1) get user based on the token
  // 2) if token has not expired, and there is user, set the new password
  // 3) Update changePasswordAt property for the user
  // 4) Log the user in, send JWT
};
