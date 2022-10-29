const { User } = require('../models')

const createUser = async (body) => {
  return await User.create(body)
}

const findUser = async (email, password) => {
  return await User.findOne({ where: { email: email, password: password } })
}

const isEmailExist = async (emalii) => {
  let emailCount = await User.count({ where: { email: `${emalii}` } })
  return emailCount ? true : false
}

const isUsernameExist = async (username) => {
  let usernameCount = await User.count({ where: { username: `${username}` } })
  return usernameCount ? true : false
}

module.exports = {
  createUser,
  findUser,
  isEmailExist,
  isUsernameExist,
}
