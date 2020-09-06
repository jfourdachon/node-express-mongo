const express = require('express');

const router = express.Router();

const {
  getAllusers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');

router.get('/', getAllusers);
router.get('/:id', getUserById);

router.post('/register', createUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
