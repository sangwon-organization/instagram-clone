const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.route('').get((req, res) => res.send('hello world..!'))
router.route('/signup').post(userController.createUser)
router.route('/signin').post()

module.exports = router
