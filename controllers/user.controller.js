const {
  createUserService,
  getAllusers,
  getUserById,
  updateUser,
  deleteUser
} = require('../services/user.service');
const User = require('../models/user.model');

exports.getAllusers = async (req, res) => {
  try {
    const users = await getAllusers();
    return res.status(200).json({
      status: 'success',
      data: {
        users
      },
      message: 'Succesfully fetching users'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

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

exports.createUser = async (req, res) => {
  //TODO check params validation
  try {
    const foundedUser = await User.findOne({ email: req.body.email });
    if (foundedUser) {
      return res
        .status(200)
        .json({ status: 400, message: 'User found', type: 'already-found' });
    }
    const user = await createUserService(req.body);
    return res.status(201).json({
      status: 'success',
      data: {
        user
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
