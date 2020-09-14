const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please tell us your name.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid email']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    select: false,
    validate: {
      //only works on SAVE and CREATE!!
      validator: function (elem) {
        return elem === this.password;
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangedAt: {
    type: Date
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  }
});

userSchema.pre('save', async function (next) {
  // Only runs if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash te password woth cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete password confirm -> not needed in DB
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  // False means password has not been change after last token
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
