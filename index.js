const bodyParser = require('body-parser')
const express = require('express')
const router = require('./src/routes')
const app = express()
const session = require('express-session')

// view engine
app.set('view engine', 'ejs')

// Session

app.use(
  session({
    secret: 'd41d8cd98f00b204e9800998ecf8427e',
    cookie: { maxAge: 30000000 }
  })
)

// static
app.use(express.static('public'))

// bodyParser
app.use(bodyParser.urlencoded({ extends: false }))
app.use(bodyParser.json())

// router
app.use('/', router)

app.listen(8081, () => {
  console.log('API runing in http://127.0.0.1:8081')
})
