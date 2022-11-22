const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { checkToken, convertFormDataToRequestBody, convertQueryToRequestBody, convertParamToRequestBody } = require('../middlewares')

router.route('/checkEmail').post(userController.checkEmail)
router.route('/checkUsername').post(userController.checkUsername)
router.route('/changePassword').post(userController.changePassword)
router.route('/followUser').post(checkToken, userController.followUser)
router.route('/followerList').get(checkToken, convertParamToRequestBody, convertQueryToRequestBody, userController.getFollowerList)
router.route('/profileImage').post(checkToken, convertFormDataToRequestBody, userController.saveProfileImage)

module.exports = router
