const httpStatus = require('http-status')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')
const { decryptAES256, encryptSHA256 } = require('../utils/encryption')
const regex = require('../utils/regex')
const userSerivce = require('../services/user')
const { Token } = require('../models')

const secret = 'test1234'

const signup = async (body) => {
  await userSerivce.checkEmail(body.email)
  await userSerivce.checkUsername(body.username)
  body.password = decryptAES256(body.password)
  await userSerivce.checkPassword(body.password)
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
  const accessToken = generateToken(user.userId, user.email, accessTokenExpires, 'access')
  const refreshTokenExpires = moment().add(60, 'days')
  const refreshToken = generateToken(user.userId, user.email, refreshTokenExpires, 'refresh')

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

const generateToken = (userId, email, expires, type, secret = 'test1234') => {
  const payload = {
    sub: userId,
    email: email,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  }
  return jwt.sign(payload, secret)
}

const getPayload = (token) => {
  let decoded = jwt.decode(token)
  return decoded.payload
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

const verifyToken = async (token) => {
  token = token.split('Bearer ').length > 1 ? token.split('Bearer ')[1] : token
  const payload = jwt.verify(token, secret)
  return payload
}

module.exports = {
  signup,
  signin,
  generateAuthTokens,
  verifyToken,
  getPayload,
}
