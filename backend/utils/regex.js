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

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidPhone,
}
