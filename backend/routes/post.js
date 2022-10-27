const express = require('express')
const Post = require('../models/post')
const router = express.Router()

router.get('', async (req, res, next) => {
  try {
    const posts = await Post.findAll()
    res.json(posts)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.post('', async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.body.userId,
    })
    console.log(post)
    res.status(201).json(post)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router
