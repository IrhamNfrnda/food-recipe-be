// import / intial
const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const compression = require('compression')
const fileUpload = require('express-fileupload')

const userRoutes = require('./routes/user.route')
const recipeRoutes = require('./routes/recipe.route')
const authRoutes = require('./routes/auth.route')
const profileRoutes = require('./routes/profile.route')

const port = 1234

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// use Helmet!
app.use(helmet())

// use xss!
app.use(xss())

// use cors
app.use(cors())

// grant access to upload file
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  })
)

// compress
app.use(compression())

// parse application/jsongit
app.use(bodyParser.json())

// add user route
app.use('/user', userRoutes)

// add recipe route
app.use('/recipe', recipeRoutes)

// add auth route
app.use('/auth', authRoutes)

// add profile route
app.use('/profile', profileRoutes)

app.get('/', (req, res) => res.send('Hello World'))

app.use("*", (req, res) => {
  res.status(404).send('404 Not Found')
})

// listener
app.listen(port)
