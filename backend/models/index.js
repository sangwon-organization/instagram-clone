'use strict'

const Sequelize = require('sequelize')
const process = require('process')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.json')[env]
const db = {}

const User = require('./user')
const Post = require('./post')
const Comment = require('./comment')
const UserFollow = require('./userFollow')
const PostLike = require('./postLike')
const CommentLike = require('./commentLike')
const Token = require('./token')
const Image = require('./image')
const PostImage = require('./postImage')

let sequelize = new Sequelize(config.database, config.username, config.password, config)

db.sequelize = sequelize
db.User = User
db.Post = Post
db.Comment = Comment
db.UserFollow = UserFollow
db.PostLike = PostLike
db.CommentLike = CommentLike
db.Token = Token
db.Image = Image
db.PostImage = PostImage

User.init(sequelize)
Post.init(sequelize)
Comment.init(sequelize)
UserFollow.init(sequelize)
PostLike.init(sequelize)
CommentLike.init(sequelize)
Token.init(sequelize)
Image.init(sequelize)
PostImage.init(sequelize)

User.associate(db)
Post.associate(db)
Comment.associate(db)
UserFollow.associate(db)
PostLike.associate(db)
CommentLike.associate(db)
Token.associate(db)
Image.associate(db)
PostImage.associate(db)

module.exports = db
