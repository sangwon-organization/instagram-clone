const express = require('express')
const router = express.Router()
const postController = require('../controllers/post')
const { checkToken } = require('../middlewares')

router.route('').post(postController.createPost)
router.route('').put(postController.updatePost)
router.route('/:postId').get(postController.getPost)
router.route('/:postId').delete(postController.deletePost)
router.route('/like').post(checkToken, postController.likePost)
router.route('/bookmark').post(checkToken, postController.bookmarkPost)

module.exports = router
