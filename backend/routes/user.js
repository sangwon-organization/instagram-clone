const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.route('/checkEmail').post(userController.checkEmail)
router.route('/checkUsername').post(userController.checkUsername)
router.route('/changePassword').post(userController.changePassword)

module.exports = router
