const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const authService = require('../services/auth')

const signup = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  await authService.signup(req.body)
  res.status(httpStatus.OK).send(Object.assign({ code: 0, message: 'success' }))
})

const signin = catchAsync(async (req, res) => {
  console.log('param:', req.body)
  const user = await authService.signin(req.body)
  const tokens = await authService.generateAuthTokens(user)
  res
    .status(httpStatus.OK)
    .send(
      Object.assign(
        { code: 0, message: 'success' },
        { accessToken: tokens.access.token, accessTokenExpiredAt: tokens.access.expires, refreshToken: tokens.refresh.token, refreshTokenExpiredAt: tokens.refresh.expires }
      )
    )
})

module.exports = {
  signup,
  signin,
}
