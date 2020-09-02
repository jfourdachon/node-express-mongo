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
router.get('/user/:id', getUserById);

router.post('/register', createUser);

router.patch('/update/:id', updateUser);

router.delete('/delete/:id', deleteUser);

module.exports = router;
