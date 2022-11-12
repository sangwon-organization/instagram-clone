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
  let result = await postService.getPostList(req, req.query.page)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }, result))
})

const createComment = catchAsync(async (req, res) => {
  await postService.createComment(req.body)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const updateComment = catchAsync(async (req, res) => {
  await postService.updateComment(req.body)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const deleteComment = catchAsync(async (req, res) => {
  await postService.deleteComment(req.body)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const likeComment = catchAsync(async (req, res) => {
  await postService.likeComment(req.body)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
})

const getCommentList = catchAsync(async (req, res) => {
  let result = await postService.getCommentList(req, req.query.postId, req.query.parentCommentId, req.query.page)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }, result))
})

module.exports = {
  createPost,
  updatePost,
  getPost,
  deletePost,
  likePost,
  bookmarkPost,
  getPostList,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  getCommentList,
}
