const express = require('express');

const router = express.Router();

const {
  getAllusers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');

const { signup, login } = require('../controllers/auth.controller');

router.post('/signup', signup);
router.post('/login', login);

router.get('/', getAllusers);
router.get('/:id', getUserById);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
