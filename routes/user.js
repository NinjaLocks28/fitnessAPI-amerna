const express = require('express');
const userController = require('../controllers/user')
const { verify } = require('../auth')

const router = express.Router();

router.post('/register', userController.registerUser)

router.post('/login', userController.loginUser)
router.get('/details', verify, userController.getProfile)

router.patch('/reset-password', verify, userController.resetPassword)


module.exports = router;