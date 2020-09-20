const User = require('../models/user.model');
const factory = require('../controllers/handlerFactory');

exports.getAllusers = async (params, next, filter) =>
  factory.getAllInService(User, params, next, filter);

exports.getUserById = async (id, next) =>
  factory.getOneInService(User, id, null, next);

exports.updateUser = (id, body, next) =>
  factory.updateOneInService(User, id, body, next);

exports.deleteUser = async (id, next) =>
  factory.deleteOneInService(User, id, next);

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
