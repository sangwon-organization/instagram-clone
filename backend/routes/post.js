const express = require('express')
const router = express.Router()
const postController = require('../controllers/post')

router.route('').post(postController.createPost)

module.exports = router
