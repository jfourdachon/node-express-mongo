const User = require('../models/user.model');

exports.createUserService = async (
  firstname,
  lastname,
  email,
  password,
  dateOfBirth
) => {
  try {
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password,
      dateOfBirth
    });
    return newUser;
  } catch (error) {
    console.log({ error });
    throw Error('Error while creating User');
  }
};
