const express = require('express')
const { getAllusers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController')

const router = express.Router()

router
    .route('/')
    .get(getAllusers).
    post(createUser)
router
    .route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router
