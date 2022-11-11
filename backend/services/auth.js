const httpStatus = require('http-status')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')
const { decryptAES256, encryptSHA256 } = require('../utils/encryption')
const userSerivce = require('../services/user')
const { Token } = require('../models')
const commonService = require('../services/common')
const { dateFormat } = require('../utils/regex')

const secret = 'test1234'

const signup = async (body) => {
  await commonService.checkValueIsEmpty(body.email, '이메일')
  await userSerivce.checkEmail(body.email)
  await commonService.checkValueIsEmpty(body.name, '이름')
  await commonService.checkValueIsEmpty(body.username, '닉네임')
  await userSerivce.checkUsername(body.username)
  await commonService.checkValueIsEmpty(body.password, '패스워드')
  //body.password = decryptAES256(body.password) => aes256 적용 코드
  await userSerivce.checkPassword(body.password)
  body.password = encryptSHA256(body.password)
  return userSerivce.createUser(body)
}

const signin = async (body) => {
  await commonService.checkValueIsEmpty(body.email, '이메일')
  await commonService.checkValueIsEmpty(body.password, '패스워드')
  // body.password = encryptSHA256(decryptAES256(body.password)) => aes256 적용 코드
  body.password = encryptSHA256(body.password)
  let user = await userSerivce.findUser(body.email, body.password)
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '이메일 또는 패스워드가 정확하지 않습니다. 다시 입력해 주세요.')
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
      expires: dateFormat(accessTokenExpires.toDate()),
    },
    refresh: {
      token: refreshToken,
      expires: dateFormat(refreshTokenExpires.toDate()),
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
  let payload
  try {
    token = token.split('Bearer ').length > 1 ? token.split('Bearer ')[1] : token
    payload = jwt.verify(token, secret)
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError(httpStatus.UNAUTHORIZED, '토큰 유효기간이 만료되었습니다. 다시 로그인 해주세요.')
    }
  }
  return payload
}

module.exports = {
  signup,
  signin,
  generateAuthTokens,
  verifyToken,
  getPayload,
}
