const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { convertFormDataToRequestBody } = require('../middlewares')

router.route('').get((req, res) => res.send('instagram clone !!'))
router.route('/signup').post(convertFormDataToRequestBody, authController.signup)
router.route('/signin').post(convertFormDataToRequestBody, authController.signin)

module.exports = router
