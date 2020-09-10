const User = require('../models/user.model');
const { createUserService } = require('../services/user.service');

exports.signup = async (req, res, next) => {
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
