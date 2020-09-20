const express = require('express');

const router = express.Router();

const {
  getAllusers,
  getUserById,
  updateMe,
  deleteMe,
  deleteUser,
  updateUser,
  getMe,
  createUser
} = require('../controllers/user.controller');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('../controllers/auth.controller');
const { protect, restrictTo } = require('../middlewares/auth');

// No authentication needed for that routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Use authentication for all routes after this middleware
router.use(protect);

router.get('/me', getMe, getUserById);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);
router.patch('/updatePassword', updatePassword);

// Only admin are authorized on that routes
router.use(restrictTo('admin'));

router.get('/', getAllusers);
router.get('/:id', getUserById);
router.post('/register', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
