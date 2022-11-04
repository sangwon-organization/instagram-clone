const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const userController = require('../controllers/user')

router.route('').get((req, res) => res.send('hello world..!'))
router.route('/signup').post(authController.signup)
router.route('/signin').post(authController.signin)

module.exports = router
