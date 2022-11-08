const express = require('express')
const morgan = require('morgan')
const { sequelize } = require('./models')
const app = express()

const indexRouter = require('./routes')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const { notFoundConverter, errorConverter, errorHandler, corsConverter } = require('./middlewares/error')

app.set('port', process.env.PORT || 3000)

sequelize
  .sync({ force: true })
  .then(() => {
    console.log('success db connection')
  })
  .catch((err) => {
    console.error(err)
  })

app.use(corsConverter)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)

app.use(notFoundConverter)
app.use(errorConverter)
app.use(errorHandler)

app.listen(app.get('port'), () => {
  console.log('listen on port', app.get('port'))
})
