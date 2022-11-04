const { Image } = require('../models')

const createImage = async (body) => {
  return await Image.create(body)
}

module.exports = {
  createImage,
}
