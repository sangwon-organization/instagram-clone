const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const sizeOf = require('image-size')
const env = process.env.NODE_ENV || 'local'
const config = require('../config/config.json')[env]
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const imageService = require('../services/image')
const commonService = require('../services/common')
const Image = require('../models/image')
const Post = require('../models/post')
const Comment = require('../models/comment')
const CommentLike = require('../models/commentLike')
const PostImage = require('../models/postImage')
const PostLike = require('../models/postLike')
const PostBookmark = require('../models/postBookmark')
const { dateFormat } = require('../utils/regex')
const authService = require('../services/auth')

const createPost = async (data) => {
  await commonService.checkValueIsEmpty(data.content, '내용')

  // 이미지를 담아 둘 디렉토리 생성
  if (env != 'production') {
    if (!fs.existsSync(config.imagePath)) {
      fs.mkdirSync(config.imagePath, { recursive: true })
    }
  }

  // 포스트 등록
  const post = await Post.create({ content: data.content, userId: data.userId })
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, '포스트 등록에 실패하였습니다. 다시 시도해주세요.')
  }

  // 이미지 등록
  for await (const [key, file] of Object.entries(data.files)) {
    const oldFilePath = file.filepath
    const imageExt = file.originalFilename.split('.')[1]
    const originalImageName = file.originalFilename.split('.')[0]
    const imageName = uuidv4()
    const dimensions = sizeOf(oldFilePath)
    const imageSize = file.size
    const imageWidth = dimensions.width
    const imageHeight = dimensions.height

    fs.rename(oldFilePath, config.imagePath + imageName + '.' + imageExt, async (err) => {
      if (err) {
        throw err
      }
      const image = await imageService.createImage({
        originalImageName,
        imageName,
        imageExt,
        imageSize,
        imageWidth,
        imageHeight,
      })
      await createPostImage({ postId: post.postId, imageId: image.imageId })
    })
  }
}

const updatePost = async (data) => {
  await commonService.checkValueIsEmpty(data.postId, 'postId')
  await commonService.checkValueIsEmpty(data.content, '내용')

  let post = await Post.findOne({
    include: [
      {
        model: PostImage,
        include: [
          {
            model: Image,
          },
        ],
      },
    ],
    where: { postId: data.postId },
  })
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 포스트가 존재하지 않습니다.')
  }

  // Post 레코드 수정
  const updatedPostCount = await Post.update(
    {
      content: data.content,
      updatedAt: Date.now(),
    },
    {
      where: {
        postId: data.postId,
      },
    }
  )

  if (!updatedPostCount[0]) {
    throw new ApiError(httpStatus.BAD_REQUEST, '포스트 수정에 실패하였습니다. 다시 시도해주세요.')
  }

  // 이미지 삭제
  const images = await Image.findAll({ where: { imageId: data.deleteImageIds } })

  await Image.destroy({ where: { imageId: data.deleteImageIds } })

  await PostImage.destroy({ where: { postId: data.postId, imageId: data.deleteImageIds } })

  images.map((image) => {
    let deleteImagePath = config.imagePath + image.imageName + '.' + image.imageExt
    fs.unlink(deleteImagePath, (err) => {
      if (!err) {
        console.log(`이미지 파일 삭제 >> ${deleteImagePath}`)
      } else {
        console.log(`이미지 파일이 존재하지 않음 >> ${deleteImagePath}`)
      }
    })
  })

  // 이미지 등록
  for await (const [key, file] of Object.entries(data.files)) {
    const oldFilePath = file.filepath
    const imageExt = file.originalFilename.split('.')[1]
    const originalImageName = file.originalFilename.split('.')[0]
    const imageName = uuidv4()
    const dimensions = sizeOf(oldFilePath)
    const imageSize = file.size
    const imageWidth = dimensions.width
    const imageHeight = dimensions.height

    fs.rename(oldFilePath, config.imagePath + imageName + '.' + imageExt, async (err) => {
      if (err) {
        throw err
      }
      const image = await imageService.createImage({
        originalImageName,
        imageName,
        imageExt,
        imageSize,
        imageWidth,
        imageHeight,
      })
      await createPostImage({ postId: data.postId, imageId: image.imageId })
    })
  }
}

const createPostImage = async (data) => {
  return await PostImage.create(data)
}

const getPost = async (req, postId) => {
  await commonService.checkValueIsEmpty(postId, 'postId')

  let post = await Post.findOne({
    include: [
      {
        model: PostImage,
        include: [
          {
            model: Image,
          },
        ],
      },
    ],
    where: { postId: postId },
  })
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

  post = {
    postId: post.postId,
    content: post.content,
    createdAt: dateFormat(post.createdAt),
    postImages: postImages,
  }

  return post
}

const deletePost = async (postId) => {
  await commonService.checkValueIsEmpty(postId, 'postId')

  let post = await Post.findOne({
    include: [
      {
        model: PostImage,
        include: [
          {
            model: Image,
          },
        ],
      },
    ],
    where: { postId: postId },
  })
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 포스트가 존재하지 않습니다.')
  }

  let postImages = await PostImage.findAll(
    {
      attributes: ['postId'],
      include: [
        {
          model: Image,
          attributes: ['imageId', 'imageName', 'imageExt'],
        },
      ],
    },
    {
      where: {
        postId: postId,
      },
    }
  )

  let imageIds = []
  let imagePaths = []
  let getImageIdPromises = postImages.map((postImage) => {
    imageIds.push(postImage.Image.imageId)
    imagePaths.push(config.imagePath + postImage.Image.imageName + '.' + postImage.Image.imageExt)
  })
  await Promise.all(getImageIdPromises)

  await PostImage.destroy({
    where: {
      postId: postId,
    },
  })

  await Image.destroy({
    where: {
      imageId: imageIds,
    },
  })

  await Post.destroy({
    where: {
      postId: postId,
    },
  })

  imagePaths.map((imagePath) => {
    fs.unlink(imagePath, (err) => {
      if (!err) {
        console.log(`이미지 파일 삭제 >> ${imagePath}`)
      } else {
        console.log(`이미지 파일이 존재하지 않음 >> ${imagePath}`)
      }
    })
  })
}

const likePost = async (userId, postId, likeYn) => {
  await commonService.checkValueIsEmpty(userId, 'userId')
  await commonService.checkValueIsEmpty(postId, 'postId')
  await commonService.checkValueIsEmpty(likeYn, 'likeYn')

  let post = await Post.findOne({
    include: [
      {
        model: PostImage,
        include: [
          {
            model: Image,
          },
        ],
      },
    ],
    where: { postId: postId },
  })
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 포스트가 존재하지 않습니다.')
  }

  if (likeYn == 'Y') {
    PostLike.upsert({ postId: postId, userId: userId, updatedAt: new Date() }, { where: { postId: postId, userId: userId } })
  } else {
    PostLike.destroy({ where: { postId: postId, userId: userId } })
  }
}

const bookmarkPost = async (userId, postId, bookmarkYn) => {
  await commonService.checkValueIsEmpty(userId, 'userId')
  await commonService.checkValueIsEmpty(postId, 'postId')
  await commonService.checkValueIsEmpty(bookmarkYn, 'bookmarkYn')

  let post = await Post.findOne({
    include: [
      {
        model: PostImage,
        include: [
          {
            model: Image,
          },
        ],
      },
    ],
    where: { postId: postId },
  })
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 포스트가 존재하지 않습니다.')
  }

  if (bookmarkYn == 'Y') {
    PostBookmark.upsert({ postId: postId, userId: userId, updatedAt: new Date() }, { where: { postId: postId, userId: userId } })
  } else {
    PostBookmark.destroy({ where: { postId: postId, userId: userId } })
  }
}

const getPostList = async (req, page = 1) => {
  let token = req.headers['authorization']
  let userId = ''
  if (token) {
    let payload = await authService.verifyToken(token)
    if (payload) {
      userId = payload.sub
    }
  }

  let pageSize = 10
  let offset = (page - 1) * pageSize
  let postList = await Post.findAll({
    attributes: ['postId', 'content', 'createdAt'],
    include: [
      {
        model: PostImage,
        attributes: ['imageId'],
        include: [
          {
            model: Image,
            attributes: ['imageName', 'imageExt'],
          },
        ],
      },
      {
        model: PostLike,
        required: false,
        where: {
          userId: userId,
        },
      },
      {
        model: PostBookmark,
        required: false,
        where: {
          userId: userId,
        },
      },
    ],
    offset: offset,
    limit: pageSize,
    order: [['createdAt', 'DESC']],
  })

  postList = postList.map((post) => {
    let postId = post.postId
    let content = post.content
    let createdAt = dateFormat(post.createdAt)
    let likeYn = post.PostLikes.length > 0 ? 'Y' : 'N'
    let bookmarkYn = post.PostBookmarks.length > 0 ? 'Y' : 'N'
    let postImageList = post.PostImages.map((postImage) => {
      if (env != 'production') {
        // storage 서버가 따로 없는 경우
        let serviceUrl = req.protocol + '://' + req.get('host')
        let imagePath = config.imagePath.split('public')[1]
        let imageName = postImage.Image.imageName
        let imageExt = postImage.Image.imageExt

        return serviceUrl + imagePath + imageName + '.' + imageExt
      } else {
        // storage 서버가 따로 있는 경우
      }
    })

    return {
      postId,
      content,
      createdAt,
      likeYn,
      bookmarkYn,
      postImageList,
    }
  })

  let result = postList
  return result
}

const createComment = async (data) => {
  await commonService.checkValueIsEmpty(data.postId, 'postId')
  await commonService.checkValueIsEmpty(data.content, '내용')
  data.parentCommentId = data.parentCommentId == '' ? undefined : data.parentCommentId

  if (data.parentCommentId) {
    let parentComment = await Comment.findOne({
      where: { commentId: data.parentCommentId },
    })
    if (!parentComment) {
      throw new ApiError(httpStatus.BAD_REQUEST, '해당 상위 댓글이 존재하지 않습니다.')
    }
  }

  let post = await Post.findOne({ where: { postId: data.postId } })
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 포스트가 존재하지 않습니다.')
  }

  let comment = await Comment.create(data)
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, '댓글 등록에 실패하였습니다. 다시 시도해주세요.')
  }
}

const updateComment = async (data) => {
  await commonService.checkValueIsEmpty(data.commentId, 'commentId')
  await commonService.checkValueIsEmpty(data.content, '내용')

  let comment = await Comment.findOne({
    where: { commentId: data.commentId },
  })
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 댓글이 존재하지 않습니다.')
  }

  const updatedCommentCount = await Comment.update(
    {
      content: data.content,
      updatedAt: Date.now(),
    },
    {
      where: {
        commentId: data.commentId,
      },
    }
  )

  if (!updatedCommentCount[0]) {
    throw new ApiError(httpStatus.BAD_REQUEST, '댓글 수정에 실패하였습니다. 다시 시도해주세요.')
  }
}

const deleteComment = async (data) => {
  await commonService.checkValueIsEmpty(data.commentId, 'commentId')

  let comment = await Comment.findOne({ where: { commentId: data.commentId } })
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 댓글이 존재하지 않습니다.')
  }

  await Comment.destroy({ where: { parentCommentId: data.commentId } })
  await Comment.destroy({ where: { commentId: data.commentId } })
}

const likeComment = async (data) => {
  await commonService.checkValueIsEmpty(data.userId, 'userId')
  await commonService.checkValueIsEmpty(data.commentId, 'commentId')
  await commonService.checkValueIsEmpty(data.likeYn, 'likeYn')

  let comment = await Comment.findOne({ where: { commentId: data.commentId } })
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 댓글이 존재하지 않습니다.')
  }

  if (data.likeYn == 'Y') {
    CommentLike.upsert({ commentId: data.commentId, userId: data.userId, updatedAt: new Date() }, { where: { commentId: data.commentId, userId: data.userId } })
  } else {
    CommentLike.destroy({ where: { commentId: data.commentId, userId: data.userId } })
  }
}

// 부모 댓글 => 20개씩
// 자식 댓글 => 10개씩

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
}
