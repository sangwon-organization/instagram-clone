const imageService = require('../services/image')
const Image = require('../models/image')
const Post = require('../models/post')
const PostImage = require('../models/postImage')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const sizeOf = require('image-size')
const env = process.env.NODE_ENV || 'local'
const config = require('../config/config.json')[env]
const commonService = require('../services/common')
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')

const createPost = async (fields, files) => {
  await commonService.checkValueIsEmpty(fields.content, '내용')

  // 이미지를 담아 둘 디렉토리 생성
  if (env != 'production') {
    if (!fs.existsSync(config.imagePath)) {
      fs.mkdirSync(config.imagePath, { recursive: true })
    }
  }

  // 포스트 등록
  const post = await Post.create(fields)
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, '포스트 등록에 실패하였습니다. 다시 시도해주세요.')
  }

  // 이미지 등록
  for await (const [key, file] of Object.entries(files)) {
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

const updatePost = async (fields, files) => {
  await commonService.checkValueIsEmpty(fields.postId, 'PostID')
  await commonService.checkValueIsEmpty(fields.content, '내용')

  let post = await getPost(fields.postId)
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 포스트가 존재하지 않습니다.')
  }

  // Post 레코드 수정
  const updatedPostCount = await Post.update(
    {
      content: fields.content,
      updatedAt: Date.now(),
    },
    {
      where: {
        postId: fields.postId,
      },
    }
  )

  if (!updatedPostCount[0]) {
    throw new ApiError(httpStatus.BAD_REQUEST, '포스트 수정에 실패하였습니다. 다시 시도해주세요.')
  }

  // 이미지 삭제
  const images = await Image.findAll({ where: { imageId: fields.deleteImageIds } })

  await Image.destroy({ where: { imageId: fields.deleteImageIds } })

  await PostImage.destroy({ where: { postId: fields.postId, imageId: fields.deleteImageIds } })

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
  for await (const [key, file] of Object.entries(files)) {
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
      await createPostImage({ postId: fields.postId, imageId: image.imageId })
    })
  }
}

const createPostImage = async (data) => {
  return await PostImage.create(data)
}

const getPost = async (postId) => {
  return await Post.findOne({
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
}

const deletePost = async (postId) => {
  await commonService.checkValueIsEmpty(postId, 'PostID')

  let post = await getPost(postId)
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

module.exports = {
  createPost,
  updatePost,
  getPost,
  deletePost,
}
