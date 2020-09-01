const { createUserService } = require('../services/user.service');

exports.getAllusers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet'
  });
};

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet'
  });
};

exports.createUser = async (req, res) => {
  const { firstname, lastname, email, password, dateOfBirth } = req.body;
  //TODO check params validation
  try {
    const user = await createUserService(
      firstname,
      lastname,
      email,
      password,
      dateOfBirth
    );
    res.status(201).json({
      status: 'success',
      data: {
        user
      },
      message: 'Succesfully user created'
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

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet'
  });
};
