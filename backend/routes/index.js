const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('hello world..!')
})

router.post('/signup', (req, res) => {})

router.post('/signin', (req, res) => {})

module.exports = router
