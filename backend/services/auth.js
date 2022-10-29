const httpStatus = require('http-status')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const ApiError = require('../utils/apiError')
const { decryptAES256, encryptSHA256 } = require('../utils/encryption')
const regex = require('../utils/regex')
const userSerivce = require('../services/user')
const { Token } = require('../models')

const signup = async (body) => {
  body.password = decryptAES256(body.password)

  if (await !regex.isValidEmail(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, '이메일 형식이 맞지 않습니다. 다시 입력해 주세요.')
  }
  if (await userSerivce.isEmailExist(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, '이미 등록된 이메일입니다. 다시 입력해 주세요.')
  }
  if (await userSerivce.isUsernameExist(body.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, '이미 등록된 닉네임입니다. 다시 입력해 주세요.')
  }
  if (await !regex.isValidPassword(body.password)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      '유효하지 않은 비밀번호입니다. 다시 입력해 주세요. (길이 최소 8자 이상 15자 이하, 대문자, 소문자, 숫자, 특수문자(@,$,!,%,*,?,&) 각각 1개 이상 필수 입력)'
    )
  }

  body.password = encryptSHA256(body.password)
  return userSerivce.createUser(body)
}

const signin = async (body) => {
  body.password = encryptSHA256(decryptAES256(body.password))
  const user = await userSerivce.findUser(body.email, body.password)
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '이메일 또는 비밀번호가 정확하지 않습니다. 다시 입력해 주세요.')
  }

  return user
}

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(60, 'minutes')
  const accessToken = generateToken(user.userId, accessTokenExpires, 'access')
  const refreshTokenExpires = moment().add(60, 'days')
  const refreshToken = generateToken(user.userId, refreshTokenExpires, 'refresh')

  await saveToken(refreshToken, user.userId, refreshTokenExpires, 'refresh')

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  }
}

const generateToken = (userId, expires, type, secret = 'test1234') => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  }
  return jwt.sign(payload, secret)
}

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    userId: userId,
    expiredAt: expires.toDate(),
    type,
    blacklisted,
  })
  return tokenDoc
}

module.exports = {
  signup,
  signin,
  generateAuthTokens,
}
