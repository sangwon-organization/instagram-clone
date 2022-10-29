const encryption = require('../utils/encryption')

describe('function', () => {
  test('test aes256', () => {
    let phrase = 'Swinging For the Fences'
    let encrypted = encryption.encryptAES256(phrase)
    let decrypted = encryption.decryptAES256(encrypted)
    expect(phrase).toBe(decrypted)
  })

  test('test sha256', () => {
    let phrase = 'Swinging For the Fences'
    let encrypted = encryption.encryptSHA256(phrase)
    expect(encrypted).toBe('fzAXD8sFThs1b3JwdJeFpmeDKSbQNMD21AvWyARPb4A=')
  })
})
