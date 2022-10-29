const httpStatus = require('http-status')
const { User } = require('../models')
const ApiError = require('../utils/apiError')
const encryption = require('../utils/encryption')
const regex = require('../utils/regex')

const createUser = async (body) => {
  if (await !regex.isValidEmail(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, '이메일 형식이 맞지 않습니다. 다시 입력해 주세요.')
  }
  if (await User.isEmailExist(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, '이미 등록된 이메일입니다. 다시 입력해 주세요.')
  }
  if (await User.isUsernameExist(body.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, '이미 등록된 닉네임입니다. 다시 입력해 주세요.')
  }
  if (await !regex.isValidPassword(body.password)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      '유효하지 않은 비밀번호입니다. 다시 입력해 주세요. (길이 최소 8자 이상 15자 이하, 대문자, 소문자, 숫자, 특수문자(@,$,!,%,*,?,&) 각각 1개 이상 필수 입력)'
    )
  }
  body.password = encryption.encryptSHA256(body.password)
  return User.create(body)
}

module.exports = {
  createUser,
}
