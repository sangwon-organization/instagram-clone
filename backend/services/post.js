const { v4: uuidv4 } = require('uuid')
const sizeOf = require('image-size')
const env = process.env.NODE_ENV || 'local'
const config = require('../config/config.json')[env]
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const imageService = require('../services/image')
const commonService = require('../services/common')
const Post = require('../models/post')
const Image = require('../models/image')
const User = require('../models/user')
const Comment = require('../models/comment')
const CommentLike = require('../models/commentLike')
const PostImage = require('../models/postImage')
const PostLike = require('../models/postLike')
const PostBookmark = require('../models/postBookmark')
const { dateFormat } = require('../utils/regex')
const authService = require('../services/auth')
const { Op } = require('sequelize')
const fs = require('fs')
const { UserFollow } = require('../models')

const createPost = async (data) => {
  await commonService.checkValueIsEmpty(data.content, '내용')

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

    console.log(__dirname, config.postImagePath)
    fs.rename(oldFilePath, __dirname + '/../' + config.postImagePath + imageName + '.' + imageExt, async (err) => {
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
  if (data.deleteImageIds) {
    const images = await Image.findAll({ where: { imageId: data.deleteImageIds } })

    await Image.destroy({ where: { imageId: data.deleteImageIds } })

    await PostImage.destroy({ where: { postId: data.postId, imageId: data.deleteImageIds } })

    images.map((image) => {
      let deleteImagePath = __dirname + '/../' + config.postImagePath + image.imageName + '.' + image.imageExt
      fs.unlink(deleteImagePath, (err) => {
        if (!err) {
          console.log(`이미지 파일 삭제 >> ${deleteImagePath}`)
        } else {
          console.log(`이미지 파일이 존재하지 않음 >> ${deleteImagePath}`)
        }
      })
    })
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

    fs.rename(oldFilePath, __dirname + '/../' + config.postImagePath + imageName + '.' + imageExt, async (err) => {
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
      let imagePath = config.postImagePath.split('public')[1]
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

const deletePost = async (data) => {
  await commonService.checkValueIsEmpty(data.postId, 'postId')

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

  await deleteComment({ postId: data.postId })
  await PostLike.destroy({ where: { postId: data.postId } })
  await PostBookmark.destroy({ where: { postId: data.postId } })

  let postImages = await PostImage.findAll({
    attributes: ['postId'],
    include: [
      {
        model: Image,
        attributes: ['imageId', 'imageName', 'imageExt'],
      },
    ],
    where: {
      postId: data.postId,
    },
  })

  let imageIds = []
  let imagePaths = []
  let getImageIdPromises = postImages.map((postImage) => {
    imageIds.push(postImage.Image.imageId)
    imagePaths.push(__dirname + '/../' + config.postImagePath + postImage.Image.imageName + '.' + postImage.Image.imageExt)
  })
  await Promise.all(getImageIdPromises)

  await PostImage.destroy({
    where: {
      postId: data.postId,
    },
  })

  await Image.destroy({
    where: {
      imageId: imageIds,
    },
  })

  await Post.destroy({
    where: {
      postId: data.postId,
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

const getPostList = async (req, data) => {
  await commonService.checkValueIsEmpty(data.page, 'page')

  let page = data.page <= 0 ? 1 : data.page
  let postList = []

  if (data.postUserId) {
    // 특정 유저 포스트 목록 조회
    let pageSize = 12
    let offset = (page - 1) * pageSize
    postList = await Post.findAll({
      attributes: ['postId', 'content', 'createdAt'],
      include: [
        {
          model: User,
          required: true,
          attributes: ['userId', 'name', 'username', 'profileImageId'],
          include: [
            {
              model: Image,
              required: false,
              attributes: ['imageName', 'imageExt'],
            },
          ],
        },
        {
          model: PostImage,
          required: false,
          attributes: ['imageId'],
          include: [
            {
              model: Image,
              required: false,
              attributes: ['imageName', 'imageExt'],
            },
          ],
        },
        {
          model: PostLike,
          required: false,
          where: {
            userId: data.userId,
          },
        },
        {
          model: PostBookmark,
          required: false,
          where: {
            userId: data.userId,
          },
        },
      ],
      where: {
        userId: data.postUserId,
      },
      offset: offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
    })
  } else {
    // 팔로우 유저들 포스트 목록 조회
    let pageSize = 10
    let offset = (page - 1) * pageSize
    postList = await Post.findAll({
      attributes: ['postId', 'content', 'createdAt'],
      include: [
        {
          model: User,
          required: true,
          attributes: ['userId', 'name', 'username', 'profileImageId'],
          include: [
            {
              model: UserFollow,
              required: true,
              attributes: ['fromUserId', 'toUserId'],
              where: {
                fromUserId: data.userId,
              },
            },
            {
              model: Image,
              required: false,
              attributes: ['imageName', 'imageExt'],
            },
          ],
        },
        {
          model: PostImage,
          required: false,
          attributes: ['imageId'],
          include: [
            {
              model: Image,
              required: false,
              attributes: ['imageName', 'imageExt'],
            },
          ],
        },
        {
          model: PostLike,
          required: false,
          where: {
            userId: data.userId,
          },
        },
        {
          model: PostBookmark,
          required: false,
          where: {
            userId: data.userId,
          },
        },
      ],
      offset: offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
    })
  }

  postList = await Promise.all(
    postList.map(async (post) => {
      let serviceUrl = env != 'production' ? req.protocol + '://' + req.get('host') : ''

      let postId = post.postId
      let userId = post.User.userId
      let name = post.User.name
      let username = post.User.username
      let content = post.content
      let createdAt = dateFormat(post.createdAt)
      let likeYn = post.PostLikes.length > 0 ? 'Y' : 'N'
      let bookmarkYn = post.PostBookmarks.length > 0 ? 'Y' : 'N'
      let commentCount = await Comment.count({ where: { postId: postId } })
      let likeCount = await PostLike.count({ where: { postId: postId } })
      let profileImage = ''
      if (!post.User.Image) {
        profileImage = serviceUrl + config.commonImagePath.split('public')[1] + 'profile.png'
      } else {
        let imagePath = config.commonImagePath.split('public')[1]
        let imageName = post.User.Image.imageName
        let imageExt = post.User.Image.imageExt
        profileImage = serviceUrl + imagePath + imageName + '.' + imageExt
      }
      let postImageList = post.PostImages.map((postImage) => {
        let imagePath = config.postImagePath.split('public')[1]
        let imageName = postImage.Image.imageName
        let imageExt = postImage.Image.imageExt

        return serviceUrl + imagePath + imageName + '.' + imageExt
      })

      return {
        postId,
        name,
        username,
        userId,
        content,
        createdAt,
        likeYn,
        bookmarkYn,
        likeCount,
        commentCount,
        profileImage,
        postImageList,
      }
    })
  )

  return { page: page, postList: postList }
}

const createComment = async (data) => {
  await commonService.checkValueIsEmpty(data.postId, 'postId')
  await commonService.checkValueIsEmpty(data.content, '내용')
  data.parentCommentId = data.parentCommentId == '' ? undefined : data.parentCommentId

  if (data.parentCommentId) {
    let parentComment = await Comment.findOne({
      where: { postId: data.postId, commentId: data.parentCommentId },
    })
    if (!parentComment) {
      throw new ApiError(httpStatus.BAD_REQUEST, '해당 상위 댓글이 존재하지 않습니다.')
    }
  } else {
    let post = await Post.findOne({ where: { postId: data.postId } })
    if (!post) {
      throw new ApiError(httpStatus.BAD_REQUEST, '해당 포스트가 존재하지 않습니다.')
    }
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
  data.postId = !data.postId ? null : data.postId
  data.commentId = !data.commentId ? null : data.commentId

  let commentList = await Comment.findAll({ where: { [Op.or]: [{ postId: data.postId }, { commentId: data.commentId }, { parentCommentId: data.commentId }] } })
  if (!commentList) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 댓글이 존재하지 않습니다.')
  }

  let commentIdList = commentList.map((comment) => {
    return comment.commentId
  })

  await CommentLike.destroy({ where: { commentId: commentIdList } })
  await Comment.destroy({ where: { [Op.or]: [{ postId: data.postId }, { commentId: data.commentId }, { parentCommentId: data.commentId }] } })
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

const getCommentList = async (req, data) => {
  await commonService.checkValueIsEmpty(data.postId, 'postId')
  await commonService.checkValueIsEmpty(data.page, 'page')

  let page = data.page <= 0 ? 1 : data.page
  let parentCommentId = !data.parentCommentId ? null : data.parentCommentId
  let postId = data.postId

  let pageSize = !parentCommentId ? 20 : 10
  let offset = (page - 1) * pageSize
  let commentList = await Comment.findAll({
    attributes: ['commentId', 'parentCommentId', 'content', 'createdAt', 'postId'],
    include: [
      {
        model: User,
        required: true,
        attributes: ['userId', 'name', 'username', 'profileImageId'],
        include: [
          {
            model: Image,
            required: false,
            attributes: ['imageName', 'imageExt'],
          },
        ],
      },
      {
        model: CommentLike,
        required: false,
        where: {
          userId: data.userId,
        },
      },
    ],
    where: {
      postId: postId,
      parentCommentId: parentCommentId,
    },
    offset: offset,
    limit: pageSize,
    order: [['createdAt', 'DESC']],
  })

  commentList = await Promise.all(
    commentList.map(async (comment) => {
      let serviceUrl = env != 'production' ? req.protocol + '://' + req.get('host') : ''

      let postId = comment.postId
      let commentId = comment.commentId
      let parentCommentId = comment.parentCommentId
      let userId = comment.User.userId
      let name = comment.User.name
      let username = comment.User.username
      let content = comment.content
      let createdAt = dateFormat(comment.createdAt)
      let likeYn = comment.CommentLikes.length > 0 ? 'Y' : 'N'
      let likeCount = await CommentLike.count({ where: { commentId: commentId } })
      let profileImage = ''
      if (!comment.User.Image) {
        profileImage = serviceUrl + config.commonImagePath.split('public')[1] + 'profile.png'
      } else {
        let imagePath = config.commonImagePath.split('public')[1]
        let imageName = comment.User.Image.imageName
        let imageExt = comment.User.Image.imageExt
        profileImage = serviceUrl + imagePath + imageName + '.' + imageExt
      }

      return {
        postId,
        commentId,
        parentCommentId,
        userId,
        name,
        username,
        content,
        createdAt,
        likeYn,
        likeCount,
        profileImage,
      }
    })
  )

  return { page: page, commentList: commentList }
}

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
