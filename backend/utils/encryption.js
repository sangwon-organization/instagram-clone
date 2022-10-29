'use strict'

const crypto = require('crypto')
const ENC_KEY = 'd195ef2bb7ad8f73acb6da5b08687e61'
const IV = '3d5268b343330767'

console.log(crypto.randomBytes(16).toString('hex'))
console.log(crypto.randomBytes(8).toString('hex'))

var encryptAES256 = (val) => {
  let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV)
  let encrypted = cipher.update(val, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

var decryptAES256 = (encrypted) => {
  let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV)
  let decrypted = decipher.update(encrypted, 'base64', 'utf8')
  return decrypted + decipher.final('utf8')
}

module.exports = { encryptAES256, decryptAES256 }
