const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const postService = require('../services/post')

const createPost = catchAsync(async (req, res) => {
  await postService.createPost(req.body)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const updatePost = catchAsync(async (req, res) => {
  await postService.updatePost(req.body)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const getPost = catchAsync(async (req, res) => {
  let post = await postService.getPost(req, req.params.postId)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }, post))
})

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePost(req.params.postId)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
})

const likePost = catchAsync(async (req, res) => {
  await postService.likePost(req.body.userId, req.body.postId, req.body.likeYn)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
})

const bookmarkPost = catchAsync(async (req, res) => {
  await postService.bookmarkPost(req.body.userId, req.body.postId, req.body.bookmarkYn)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
})

const getPostList = catchAsync(async (req, res) => {
  let postList = await postService.getPostList(req, req.query.page)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }, { postList: postList }))
})

module.exports = {
  createPost,
  updatePost,
  getPost,
  deletePost,
  likePost,
  bookmarkPost,
  getPostList,
}
