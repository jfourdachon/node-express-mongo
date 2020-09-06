const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'A user must have a firstname'],
    trim: true
  },
  lastname: {
    type: String,
    required: [true, 'A user must have a lastname'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    select: false
  },
  date_of_birth: {
    type: Date,
    required: [true, 'A user must have a date of birth'],
    default: Date.now()
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
