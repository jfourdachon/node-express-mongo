const User = require('../models/user.model');
const factory = require('../controllers/handlerFactory');

exports.getAllusers = (params, next, filter) =>
  factory.getAllInService(User, params, next, filter);

exports.getUserById = (id, next) =>
  factory.getOneInService(User, id, null, next);

exports.createUser = (args, next) =>
  factory.createOneInService(User, args, next);

exports.updateUser = (id, body, next) =>
  factory.updateOneInService(User, id, body, next);

exports.deleteUser = (id, next) => factory.deleteOneInService(User, id, next);

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
