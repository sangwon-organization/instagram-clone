const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const authService = require('../services/auth')
const ApiError = require('../utils/ApiError')
const postService = require('../services/post')
const formidable = require('formidable')
const { PostImage } = require('../models')

const createPost = catchAsync(async (req, res) => {
  let token = req.headers['authorization']

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '토큰 값이 유효하지 않습니다. 다시 로그인을 해주세요.')
  }

  let payload = await authService.verifyToken(token)
  if (!payload) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '토큰 값이 유효하지 않습니다. 다시 로그인을 해주세요.')
  }

  const form = formidable({ multiples: true })
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' })
      res.end(String(err))
      return
    }

    fields = Object.assign(fields, { userId: payload.sub })
    await postService.createPost(fields, files)
    res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
  })
})

const updatePost = catchAsync(async (req, res) => {
  let token = req.headers['authorization']

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '토큰 값이 유효하지 않습니다. 다시 로그인을 해주세요.')
  }

  let payload = await authService.verifyToken(token)
  if (!payload) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '토큰 값이 유효하지 않습니다. 다시 로그인을 해주세요.')
  }

  const form = formidable({ multiples: true })
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' })
      res.end(String(err))
      return
    }

    fields = Object.assign(fields, { userId: payload.sub })
    await postService.updatePost(fields, files)
    res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
  })
})

const getPost = catchAsync(async (req, res) => {
  let token = req.headers['authorization']

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '토큰 값이 유효하지 않습니다. 다시 로그인을 해주세요.')
  }

  let payload = await authService.verifyToken(token)
  if (!payload) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '토큰 값이 유효하지 않습니다. 다시 로그인을 해주세요.')
  }

  const post = await postService.getPost(req.params.postId)

  // responstDTO 생성
  const postImages = []
  const promises = post.PostImages.map(async (PostImage, index) => {
    let image = PostImage.Image
    postImages.push(image)
  })
  await Promise.all(promises)
  const result = { postId: post.postId, content: post.content, createdAt: post.createdAt, postImages: postImages }
  console.log('result:', result)

  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }, result))
})

module.exports = {
  createPost,
  updatePost,
  getPost,
}
