const httpStatus = require('http-status')
const apiError = require('../utils/apiError')
const catchAsync = require('../utils/catchAsync')
const userService = require('../services/user')

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body)
  res.status(httpStatus.OK).send()
})

module.exports = {
  createUser,
}
