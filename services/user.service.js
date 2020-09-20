const { deleteOneInService } = require('../controllers/handlerFactory');
const User = require('../models/user.model');
const AppError = require('../utils/appError');

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

exports.updateMe = async (user, filteredBody, res) => {
  const updatedUser = await User.findByIdAndUpdate(user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    data: {
      status: 'success',
      user: updatedUser
    }
  });
};

exports.deleteMe = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
};

exports.deleteUser = async (id, next) => {
  return deleteOneInService(User, id, next);
};
