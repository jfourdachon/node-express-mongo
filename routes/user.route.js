const express = require('express');

const router = express.Router();

const {
  getAllusers,
  getUserById,
  updateMe,
  deleteMe,
  deleteUser,
  updateUser,
  getMe
} = require('../controllers/user.controller');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('../controllers/auth.controller');
const { protect, restrictTo } = require('../middlewares/auth');

router.get('/me', protect, getMe, getUserById);
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updatePassword', protect, updatePassword);

router.get('/', getAllusers);
router.get('/:id', getUserById);

router.patch('/updateMe', protect, updateMe);
router.patch('/:id', protect, updateUser);

router.delete('/deleteMe', protect, deleteMe);
router.delete('/:id', protect, restrictTo('admin'), deleteUser);

module.exports = router;
