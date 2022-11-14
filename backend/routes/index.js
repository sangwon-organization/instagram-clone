const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { convertFormDataToRequestBody } = require('../middlewares')

router.route('').get((req, res) => res.send('instagram clone !!'))
router.route('/signup').post(authController.signup)
router.route('/signin').post(authController.signin)

module.exports = router
