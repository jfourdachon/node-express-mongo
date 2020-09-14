const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { signup, login } = require('../services/user.service');
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

// Middleware to protect routes for logged users only
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access.', 401)
    );
  }
  // 2) Verification token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) Check if user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belongnig to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the JWT was issued
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
