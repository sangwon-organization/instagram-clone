const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const authService = require('../services/auth')
const catchAsync = require('../utils/catchAsync')

const corsConverter = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
}

const notFoundConverter = (req, res, next) => {
  const statusCode = httpStatus.NOT_FOUND
  const message = httpStatus[statusCode]
  let error = new ApiError(statusCode, message, false)
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
}

const errorConverter = (err, req, res, next) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || httpStatus[statusCode]
    error = new ApiError(statusCode, message, false, err.stack)
  }
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[statusCode]
  }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  }

  console.log(err)
  res.status(statusCode).send(response)
}

const checkToken = catchAsync(async (req, res, next) => {
  let token = req.headers['authorization']

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '토큰이 존재하지 않습니다. 다시 로그인을 해주세요.')
  }

  let payload = await authService.verifyToken(token)
  if (!payload) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '토큰 값이 유효하지 않습니다. 다시 로그인을 해주세요.')
  }

  req.body.userId = payload.sub
  next()
})

module.exports = {
  corsConverter,
  notFoundConverter,
  errorConverter,
  errorHandler,
  checkToken,
}
