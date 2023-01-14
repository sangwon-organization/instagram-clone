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
const { Op, where, QueryTypes } = require('sequelize')
const fs = require('fs')
const { UserFollow, sequelize } = require('../models')

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

const getPost = async (req, data) => {
  await commonService.checkValueIsEmpty(data.postId, 'postId')
  let serviceUrl = env != 'production' ? req.protocol + '://' + req.get('host') : ''
  let commonImagePath = config.commonImagePath.split('public')[1]
  let postImagePath = config.postImagePath.split('public')[1]
  let profileImagePath = config.profileImagePath.split('public')[1]

  let post = await Post.findOne({
    include: [
      {
        model: User,
        require: true,
        include: [
          { model: Image, required: false },
          { model: UserFollow, as: 'ToUserFollow', required: false, where: { fromUserId: data.userId } },
        ],
      },
      { model: PostImage, required: false, include: [{ model: Image, require: false }] },
      { model: PostLike, required: false },
      { model: PostLike, required: false, as: 'LoginUserPostLike', where: { userId: data.userId } },
      { model: PostBookmark, required: false, where: { userId: data.userId } },
      { model: Comment, required: false, attributes: ['commentId'] },
    ],
    where: { postId: data.postId },
  })

  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 포스트가 존재하지 않습니다.')
  }

  post = {
    userId: post.userId,
    username: post.User.username,
    name: post.User.name,
    postId: post.postId,
    content: post.content,
    createdAt: dateFormat(post.createdAt),
    updatedAt: dateFormat(post.updatedAt),
    bookmarkYn: post.PostBookmarks.length > 0 ? 'Y' : 'N',
    followYn: post.User.ToUserFollow.length > 0 ? 'Y' : 'N',
    likeYn: post.LoginUserPostLike.length > 0 ? 'Y' : 'N',
    likeCount: post.PostLikes.length,
    commentCount: post.Comments.length,
    profileImage: post.User.Image ? serviceUrl + profileImagePath + post.User.Image.imageName + '.' + post.User.Image.imageExt : serviceUrl + commonImagePath + 'profile.png',
    postImageList: post.PostImages.map((postImage) => {
      return serviceUrl + postImagePath + postImage.Image.imageName + '.' + postImage.Image.imageExt
    }),
  }

  let comments = await Comment.findAll({
    include: [
      { model: User, require: true, include: { model: Image, required: false } },
      { model: CommentLike, required: false },
      { model: CommentLike, required: false, as: 'LoginUserCommentLike', where: { userId: data.userId } },
    ],
    where: { postId: data.postId },
    offset: 0,
    limit: 20,
    order: [['createdAt', 'asc']],
  })

  comments = comments.map((comment) => {
    return {
      userId: comment.userId,
      username: comment.User.username,
      name: comment.User.name,
      commentId: comment.commentId,
      parentCommentId: comment.parentCommentId,
      content: comment.content,
      createdAt: dateFormat(comment.createdAt),
      updatedAt: dateFormat(comment.updatedAt),
      likeYn: comment.LoginUserCommentLike.length > 0 ? 'Y' : 'N',
      likeCount: comment.CommentLikes.length,
      profileImage: comment.User.Image ? serviceUrl + profileImagePath + comment.User.Image.imageName + '.' + comment.User.Image.imageExt : serviceUrl + commonImagePath + 'profile.png',
    }
  })
  post.commentList = comments

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
  let serviceUrl = env != 'production' ? req.protocol + '://' + req.get('host') : ''
  let commonImagePath = config.commonImagePath.split('public')[1]
  let postImagePath = config.postImagePath.split('public')[1]
  let profileImagePath = config.profileImagePath.split('public')[1]

  let page = data.page <= 0 ? 1 : data.page
  let postList = []

  if (data.targetUserId) {
    // 특정 유저 포스트 목록 조회
    let pageSize = 12
    let offset = (page - 1) * pageSize
    postList = await Post.findAll({
      include: [
        {
          model: User,
          required: true,
          include: [
            { model: Image, required: false },
            { model: UserFollow, as: 'ToUserFollow', required: false, where: { fromUserId: data.userId } },
          ],
        },
        { model: PostImage, required: false, include: [{ model: Image, required: false }] },
        { model: PostLike, required: false },
        { model: PostLike, required: false, as: 'LoginUserPostLike', where: { userId: data.userId } },
        { model: PostBookmark, required: false, where: { userId: data.userId } },
        { model: Comment, required: false, attributes: ['commentId'] },
      ],
      where: { userId: data.targetUserId },
      offset: offset,
      limit: pageSize,
      order: [['createdAt', 'desc']],
    })

    postList = await Promise.all(
      postList.map(async (post) => {
        return {
          userId: post.userId,
          username: post.User.username,
          name: post.User.name,
          postId: post.postId,
          content: post.content,
          createdAt: dateFormat(post.createdAt),
          updatedAt: dateFormat(post.updatedAt),
          bookmarkYn: post.PostBookmarks.length > 0 ? 'Y' : 'N',
          followYn: post.User.ToUserFollow.length > 0 ? 'Y' : 'N',
          likeYn: post.LoginUserPostLike.length > 0 ? 'Y' : 'N',
          likeCount: post.PostLikes.length,
          commentCount: post.Comments.length,
          profileImage: post.User.Image ? serviceUrl + profileImagePath + post.User.Image.imageName + '.' + post.User.Image.imageExt : serviceUrl + commonImagePath + 'profile.png',
          postImageList: post.PostImages.map((postImage) => {
            return serviceUrl + postImagePath + postImage.Image.imageName + '.' + postImage.Image.imageExt
          }),
        }
      })
    )
  } else {
    // 팔로우 유저들 & 로그인한 유저의 포스트 목록 조회
    let pageSize = 10
    let offset = (page - 1) * pageSize

    let query = `
    SELECT *
      FROM (SELECT tp.user_id,
                   tu.username,
                   tu.name,
                   tp.post_id,
                   tp.content,
                   tp.created_at,
                   tp.updated_at,
                   'N' follow_y,
                   if((select count(1) from tb_post_bookmark tpb where tpb.post_id = tp.post_id and tpb.user_id = ${data.userId}) = 1, 'Y', 'N') bookmark_yn,
                   if((select count(1) from tb_post_like tpl where tpl.post_id = tp.post_id and tpl.user_id = ${data.userId}) = 1, 'Y', 'N') like_yn,
                   (select count(1) from tb_post_like tpl where tpl.post_id = tp.post_id) like_count,
                   (select count(1) from tb_comment tc where tc.post_id = tp.post_id) comment_count,
                   concat(ti.image_name, '.', ti.image_ext) profile_image
              FROM tb_post tp
             INNER JOIN tb_user tu ON tp.user_id = tu.user_id
              LEFT JOIN tb_image ti ON ti.image_id = tu.profile_image_id
             WHERE tu.user_id = ${data.userId}
             UNION ALL
            SELECT tp.user_id,
                   tu.username,
                   tu.name,
                   tp.post_id,
                   tp.content,
                   tp.created_at,
                   tp.updated_at,
                   if(tuf.from_user_id is null, 'N', 'Y') follow_y,
                   if((select count(1) from tb_post_bookmark tpb where tpb.post_id = tp.post_id and tpb.user_id = ${data.userId}) = 1, 'Y', 'N') bookmark_yn,
                   if((select count(1) from tb_post_like tpl where tpl.post_id = tp.post_id and tpl.user_id = ${data.userId}) = 1, 'Y', 'N') like_yn,
                   (select count(1) from tb_post_like tpl where tpl.post_id = tp.post_id) like_count,
                   (select count(1) from tb_comment tc where tc.post_id = tp.post_id) comment_count,
                   concat(ti.image_name, '.', ti.image_ext) profile_image
              FROM tb_post tp
             INNER JOIN tb_user tu ON tp.user_id = tu.user_id
             INNER JOIN tb_user_follow tuf ON tuf.to_user_id = tu.user_id
              LEFT JOIN tb_image ti ON ti.image_id = tu.profile_image_id
             WHERE tuf.from_user_id = ${data.userId}) tp
     ORDER BY tp.created_at DESC
     LIMIT ${pageSize} OFFSET ${offset}`

    postList = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    })

    // 포스트 이미지 조회
    let postIdList = postList.map((post) => {
      return post.post_id
    })

    let selectPostImageQuery = `
    select tpi.post_id, concat(ti.image_name, '.', ti.image_ext) post_image
      from tb_post_image tpi
     inner join tb_image ti on tpi.image_id = ti.image_id
     `
    if (postIdList.length > 0) {
      selectPostImageQuery += `where tpi.post_id in (${postIdList})`
    }

    let postImageList = await sequelize.query(selectPostImageQuery, {
      type: QueryTypes.SELECT,
    })

    /*
    postList = await Post.findAll({
      include: [
        {
          model: User,
          required: true,
          include: [
            { model: Image, required: false },
            { model: UserFollow, as: 'ToUserFollow', required: false, where: { fromUserId: data.userId } },
          ],
        },
        { model: PostImage, required: false, include: [{ model: Image, require: false }] },
        { model: PostLike, required: false },
        { model: PostLike, required: false, as: 'LoginUserPostLike', where: { userId: data.userId } },
        { model: PostBookmark, required: false, where: { userId: data.userId } },
        { model: Comment, required: false, attributes: ['commentId'] },
      ],
      offset: offset,
      limit: pageSize,
      order: [['createdAt', 'desc']],
    })
    */

    postList = await Promise.all(
      postList.map(async (post) => {
        return {
          userId: post.user_id,
          username: post.username,
          name: post.name,
          postId: post.post_id,
          content: post.content,
          createdAt: dateFormat(post.created_at),
          updatedAt: dateFormat(post.updated_at),
          bookmarkYn: post.bookmark_yn,
          followYn: post.follow_yn,
          likeYn: post.like_yn,
          likeCount: post.like_count,
          commentCount: post.comment_count,
          profileImage: post.profile_image ? serviceUrl + profileImagePath + post.profile_image : serviceUrl + commonImagePath + 'profile.png',
          postImageList: postImageList
            .filter((postImage) => {
              if (postImage.post_id == post.post_id) {
                return postImage
              }
            })
            .map((postImage) => {
              return serviceUrl + postImagePath + postImage.post_image
            }),
          /*
          postImageList: post.PostImages.map((postImage) => {
            return serviceUrl + postImagePath + postImage.Image.imageName + '.' + postImage.Image.imageExt
          }),
          */
        }
      })
    )
  }

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
        let imagePath = config.profileImagePath.split('public')[1]
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
