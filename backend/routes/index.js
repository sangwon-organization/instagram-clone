const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.route('').get((req, res) => res.send('instagram clone !!'))
router.route('/signup').post(authController.signup)
router.route('/signin').post(authController.signin)

module.exports = router
