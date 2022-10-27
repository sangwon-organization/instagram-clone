const express = require('express')
const morgan = require('morgan')
const { sequelize } = require('./models')
const app = express()

const indexRouter = require('./routes')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const { ValidationError } = require('sequelize')
const { notFoundConverter, errorConverter, errorHandler } = require('./middlewares/error')
const ApiError = require('./utils/ApiError')
const httpStatus = require('http-status')

app.set('port', process.env.PORT || 3000)

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('success db connection')
  })
  .catch((err) => {
    console.error(err)
  })

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)

app.use(notFoundConverter)
app.use(errorConverter)
app.use(errorHandler)

app.listen(app.get('port'), () => {
  console.log('listen on port', app.get('port'))
})
