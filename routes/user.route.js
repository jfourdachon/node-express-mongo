const express = require('express');
const {
  getAllusers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');

const router = express.Router();

router.route('/').get(getAllusers);
router.route('/register').post(createUser);
router.route('/user/:id').get(getUserById);
router.route('/update/:id').patch(updateUser);
router.route('/delete/:id').delete(deleteUser);
module.exports = router;
