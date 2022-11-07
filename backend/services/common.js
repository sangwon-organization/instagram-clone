const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')

const checkValueIsEmpty = async (value, message) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${message}은(는) 필수 입력 값 입니다.`)
  }
}

module.exports = {
  checkValueIsEmpty,
}
