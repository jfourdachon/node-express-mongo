const {
  getAllusers,
  getUserById,
  updateUser,
  deleteUser
} = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

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

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet'
  });
};

exports.updateUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: {
        user
      },
      message: 'User updated'
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

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
