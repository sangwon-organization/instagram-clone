const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const postService = require('../services/post')

const createPost = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  await postService.createPost(req.body)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const updatePost = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  await postService.updatePost(req.body)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const getPost = catchAsync(async (req, res) => {
  console.log('param:', req.params)
  let post = await postService.getPost(req, req.params.postId)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }, post))
})

const deletePost = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  await postService.deletePost(req.body)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
})

const likePost = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  await postService.likePost(req.body.userId, req.body.postId, req.body.likeYn)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
})

const bookmarkPost = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  await postService.bookmarkPost(req.body.userId, req.body.postId, req.body.bookmarkYn)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
})

const getPostList = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  let result = await postService.getPostList(req, req.body)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }, result))
})

const createComment = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  await postService.createComment(req.body)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const updateComment = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  await postService.updateComment(req.body)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const deleteComment = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  await postService.deleteComment(req.body)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const likeComment = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  await postService.likeComment(req.body)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
})

const getCommentList = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  let result = await postService.getCommentList(req, req.body)
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
