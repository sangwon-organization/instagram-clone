const imageService = require('../services/image')
const Image = require('../models/image')
const Post = require('../models/post')
const PostImage = require('../models/postImage')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const sizeOf = require('image-size')

const createPost = async (fields, files) => {
  const post = await Post.create(fields)
  console.log(fields)

  // 이미지 등록
  for await (const [key, file] of Object.entries(files)) {
    const oldFilePath = file.filepath
    const imagePath = 'C:/node_workspace/instagram-clone/backend/images/'
    const imageExt = file.originalFilename.split('.')[1]
    const originalImageName = file.originalFilename.split('.')[0]
    const imageName = uuidv4()
    const dimensions = sizeOf(oldFilePath)
    const imageSize = file.size
    const imageWidth = dimensions.width
    const imageHeight = dimensions.height

    fs.rename(oldFilePath, imagePath + imageName, async (err) => {
      if (err) {
        throw err
      }
      const image = await imageService.createImage({
        originalImageName,
        imageName,
        imagePath,
        imageSize,
        imageWidth,
        imageHeight,
        imageExt,
      })
      await createPostImage({ postId: post.postId, imageId: image.imageId })
    })
  }
}

const updatePost = async (fields, files) => {
  // 1. Image 레코드 조회
  const images = await Image.findAll({ where: { imageId: fields.deleteImageIds } })

  // 2. Image 레코드 삭제
  Image.destroy({ where: { imageId: fields.deleteImageIds } })

  // 3. PostImage 레코드 삭제
  PostImage.destroy({ where: { postId: fields.postId, imageId: fields.deleteImageIds } })

  // 4. 이미지 파일 삭제
  const deleteImagePromises = images.map(async (image, index) => {
    const imagePath = image.imagePath + image.imageName
    fs.unlinkSync(imagePath)
  })
  await Promise.all(deleteImagePromises)

  // 5. Post 레코드 수정
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

  // 6. 새로 등록할 이미지 파일 등록
  // 7. Image 레코드 추가
  // 8. PostImage 레코드 추가
  for await (const [key, file] of Object.entries(files)) {
    const oldFilePath = file.filepath
    const imagePath = 'C:/node_workspace/instagram-clone/backend/images/'
    const imageExt = file.originalFilename.split('.')[1]
    const originalImageName = file.originalFilename.split('.')[0]
    const imageName = uuidv4()
    const dimensions = sizeOf(oldFilePath)
    const imageSize = file.size
    const imageWidth = dimensions.width
    const imageHeight = dimensions.height

    fs.rename(oldFilePath, imagePath + imageName, async (err) => {
      if (err) {
        throw err
      }
      const image = await imageService.createImage({
        originalImageName,
        imageName,
        imagePath,
        imageSize,
        imageWidth,
        imageHeight,
        imageExt,
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

module.exports = {
  createPost,
  updatePost,
  getPost,
}
