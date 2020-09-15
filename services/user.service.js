const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
exports.signup = async ({
  username,
  email,
  photo,
  password,
  passwordConfirm,
  passwordChangedAt,
  role
}) => {
  try {
    const newUser = await User.create({
      username,
      email,
      photo,
      password,
      passwordConfirm,
      passwordChangedAt,
      role
    });

    const token = signToken(newUser.id);

    const result = {
      newUser,
      token
    };
    return result;
  } catch (error) {
    throw Error(`Error while creating User: ${error}`);
  }
};

exports.login = async (id, res, next) => {
  try {
    const token = signToken(id);
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (error) {
    return next(new AppError(error.message, 404));
  }
};

exports.getAllusers = async (next) => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    return next(new AppError(error.message, 404));
  }
};
exports.getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw Error(`User with id: ${id} has not been found`);
  }
};

exports.updateUser = async (id, body) => {
  try {
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });
    return user;
  } catch (error) {
    throw Error(`Error while updating user: ${error}`);
  }
};

exports.deleteUser = async (id) => {
  try {
    await User.findOneAndDelete({ _id: id });
  } catch (err) {
    throw Error(`Error while deleting user: ${err}`);
  }
};

exports.forgotPassword = async (user, req, res, next) => {
  // 1) Generate a random reset token
  const resetToken = user.createPasswordResetToken();
  // Save passwordResetExpires and passwordResetToken
  await user.save({ validateBeforeSave: false });
  // 2) Send it to user email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and\npasswordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 10 minutes)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
};
