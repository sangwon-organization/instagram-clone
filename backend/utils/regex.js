const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
const phoneRegex = /(010)-?([0-9]{4})-?([0-9]{4})|01(|1|6|7|8|9)-?([0-9]{3,4})-?([0-9]{4})$/

const isValidEmail = (email) => {
  return email.match(emailRegex) ? true : false
}

const isValidPassword = (password) => {
  return password.match(passwordRegex) ? true : false
}

const isValidPhone = (phone) => {
  return phone.match(phoneRegex) ? true : false
}

const dateFormat = (date) => {
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  month = month >= 10 ? month : '0' + month
  day = day >= 10 ? day : '0' + day
  hour = hour >= 10 ? hour : '0' + hour
  minute = minute >= 10 ? minute : '0' + minute
  second = second >= 10 ? second : '0' + second

  return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  dateFormat,
}
