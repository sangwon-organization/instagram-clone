const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const authService = require('../services/auth')
const ApiError = require('../utils/ApiError')
const postService = require('../services/post')
const formidable = require('formidable')
const env = process.env.NODE_ENV || 'local'
const config = require('../config/config.json')[env]

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
  const post = await postService.getPost(req.params.postId)

  const postImages = []
  const promises = post.PostImages.map(async (PostImage) => {
    if (env != 'production') {
      // storage 서버가 따로 없는 경우
      var serviceUrl = req.protocol + '://' + req.get('host')
      let imagePath = config.imagePath.split('public')[1]
      let imageName = PostImage.Image.imageName
      let imageExt = PostImage.Image.imageExt
      postImages.push(serviceUrl + imagePath + imageName + '.' + imageExt)
    } else {
      // storage 서버가 따로 있는 경우
    }
  })
  await Promise.all(promises)

  const result = { postId: post.postId, content: post.content, createdAt: post.createdAt, postImages: postImages }
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }, result))
})

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePost(req.params.postId)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
})

module.exports = {
  createPost,
  updatePost,
  getPost,
  deletePost,
}
