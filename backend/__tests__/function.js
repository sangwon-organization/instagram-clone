const encryption = require('../utils/encryption')

describe('function', () => {
  test('test aes256', () => {
    let phrase = 'Test5678@$!%'
    let encrypted = encryption.encryptAES256(phrase)
    console.log(encrypted)
    let decrypted = encryption.decryptAES256(encrypted)
    console.log(decrypted)
    expect(phrase).toBe(decrypted)
  })

  test('test sha256', () => {
    let phrase = 'Swinging For the Fences'
    let encrypted = encryption.encryptSHA256(phrase)
    expect(encrypted).toBe('fzAXD8sFThs1b3JwdJeFpmeDKSbQNMD21AvWyARPb4A=')
  })
})
