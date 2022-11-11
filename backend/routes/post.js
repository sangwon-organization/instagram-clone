const express = require('express')
const router = express.Router()
const postController = require('../controllers/post')
const { checkToken, convertFormDataToRequestBody } = require('../middlewares')

router.route('').post(checkToken, convertFormDataToRequestBody, postController.createPost)
router.route('').put(checkToken, convertFormDataToRequestBody, postController.updatePost)
router.route('/comment').post(checkToken, postController.createComment)
router.route('/comment').put(checkToken, postController.updateComment)
router.route('/comment').delete(checkToken, postController.deleteComment)
router.route('/comment/like').post(checkToken, postController.likeComment)
router.route('/list').get(postController.getPostList)
router.route('/like').post(checkToken, postController.likePost)
router.route('/bookmark').post(checkToken, postController.bookmarkPost)
router.route('/:postId').get(postController.getPost)
router.route('/:postId').delete(postController.deletePost)

module.exports = router
