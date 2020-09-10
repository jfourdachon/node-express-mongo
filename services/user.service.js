const User = require('../models/user.model');

exports.createUserService = async ({
  username,
  email,
  photo,
  password,
  passwordConfirm
}) => {
  try {
    const newUser = await User.create({
      username,
      email,
      photo,
      password,
      passwordConfirm
    });
    return newUser;
  } catch (error) {
    throw Error(`Error while creating User: ${error}`);
  }
};

exports.getAllusers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw Error(`Error while getting users: ${error}`);
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
