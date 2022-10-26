const express = require('express')

const app = express()
app.set('port', process.env.PORT || 3000)

app.get('/', (req, res) => {
  res.send('hello world..!')
})

app.listen(app.get('port'), () => {
  console.log('listen on port', app.get('port'))
})
