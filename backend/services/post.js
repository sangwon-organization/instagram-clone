const Post = require('../models/post')
const imageService = require('../services/image')
const PostImage = require('../models/postImage')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const createPost = async (fields, files) => {
  const post = await Post.create(fields)

  for (const [key, file] of Object.entries(files)) {
    const oldFilePath = file.filepath
    const newFileName = uuidv4() + '.' + file.originalFilename.split('.')[1]
    const newFilePath = './backend/images/' + newFileName
    fs.rename(oldFilePath, newFilePath, async (err) => {
      if (err) throw err
      const image = await imageService.createImage({ imagePath: newFilePath })
      PostImage.create({ postId: post.postId, imageId: image.imageId })
    })
  }
}

module.exports = {
  createPost,
}
