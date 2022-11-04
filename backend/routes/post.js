const express = require('express')
const router = express.Router()
const postController = require('../controllers/post')

router.route('').post(postController.createPost)
router.route('').put(postController.updatePost)
router.route('/:postId').get(postController.getPost)
router.route('/:postId').delete(postController.deletePost)

module.exports = router
