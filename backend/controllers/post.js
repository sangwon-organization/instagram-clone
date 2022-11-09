const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const authService = require('../services/auth')
const ApiError = require('../utils/ApiError')
const postService = require('../services/post')
const formidable = require('formidable')
const env = process.env.NODE_ENV || 'local'
const config = require('../config/config.json')[env]
const commonService = require('../services/common')

const createPost = catchAsync(async (req, res) => {
  let token = req.headers['authorization']

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '토큰 값이 유효하지 않습니다. 다시 로그인을 해주세요.')
  }

  let payload = await authService.verifyToken(token)
  if (!payload) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '토큰 값이 유효하지 않습니다. 다시 로그인을 해주세요.')
  }

  let form = formidable({ multiples: true })
  let fields = {}
  let files = {}
  await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        throw err
      }
      resolve({ fields: Object.assign(fields, { userId: payload.sub }), files: files })
    })
  }).then((value) => {
    fields = value.fields
    files = value.files
  })

  await postService.createPost(fields, files)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
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

  let form = formidable({ multiples: true })
  let fields = {}
  let files = {}
  await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        throw err
      }
      resolve({ fields: Object.assign(fields, { userId: payload.sub }), files: files })
    })
  }).then((value) => {
    fields = value.fields
    files = value.files
  })

  await postService.updatePost(fields, files)
  res.status(httpStatus.OK).send({ code: 0, message: 'success' })
})

const getPost = catchAsync(async (req, res) => {
  await commonService.checkValueIsEmpty(req.params.postId, 'postId')

  let post = await postService.getPost(req.params.postId)
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 포스트가 존재하지 않습니다.')
  }

  let postImages = []
  let promises = post.PostImages.map((PostImage) => {
    if (env != 'production') {
      // storage 서버가 따로 없는 경우
      let serviceUrl = req.protocol + '://' + req.get('host')
      let imagePath = config.imagePath.split('public')[1]
      let imageName = PostImage.Image.imageName
      let imageExt = PostImage.Image.imageExt
      postImages.push(serviceUrl + imagePath + imageName + '.' + imageExt)
    } else {
      // storage 서버가 따로 있는 경우
    }
  })
  await Promise.all(promises)

  let result = { postId: post.postId, content: post.content, createdAt: post.createdAt, postImages: postImages }
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }, result))
})

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePost(req.body.postId)
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

module.exports = {
  createPost,
  updatePost,
  getPost,
  deletePost,
  likePost,
  bookmarkPost,
}
