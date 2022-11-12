const express = require('express')
const morgan = require('morgan')
const { sequelize } = require('./models')
const app = express()
const path = require('path')
const fs = require('fs')
const env = process.env.NODE_ENV || 'local'
const config = require('./config/config.json')[env]

const indexRouter = require('./routes')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const { notFoundConverter, errorConverter, errorHandler, corsConverter } = require('./middlewares')

app.set('port', process.env.PORT || 3000)

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('success db connection')
  })
  .catch((err) => {
    console.error(err)
  })

// 이미지를 담아 둘 디렉토리 생성
if (env != 'production') {
  if (!fs.existsSync(config.postImagePath)) {
    fs.mkdirSync(config.postImagePath, { recursive: true })
  }
  if (!fs.existsSync(config.profileImagePath)) {
    fs.mkdirSync(config.profileImagePath, { recursive: true })
  }
}

app.use(corsConverter)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)

app.use(notFoundConverter)
app.use(errorConverter)
app.use(errorHandler)

app.listen(app.get('port'), () => {
  console.log('listen on port', app.get('port'))
})
