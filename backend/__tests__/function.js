const encryption = require('../utils/encryption')

describe('function', () => {
  test('test aes256', () => {
    let phrase = 'Swinging For the Fences'
    let encryptStr = encryption.encryptAES256(phrase)
    let decryptStr = encryption.decryptAES256(encryptStr)
    expect(phrase).toBe(decryptStr)
  })
})
