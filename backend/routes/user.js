const express = require('express')
require('express-async-errors')
const router = express.Router()
const User = require('../models/user')

router.get('', async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.post('', async (req, res, next) => {
  const user = await User.create({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    nickname: req.body.nickname,
  })
  console.log(`insert user => email: ${req.body.email}, name: ${req.body.name}`)
  res.json(user)
})

module.exports = router
