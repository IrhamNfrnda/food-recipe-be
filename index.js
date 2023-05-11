// import / intial
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const compression = require('compression')
const userRoutes = require('./routes/user.route')
const recipeRoutes = require('./routes/recipe.route')

const port = 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// use Helmet!
app.use(helmet())

// use xss!
app.use(xss())

// use cors
app.use(cors())

// compress
app.use(compression())

// parse application/jsongit
app.use(bodyParser.json())

// add user route
app.use('/user', userRoutes)

// add recipe route
app.use('/recipe', recipeRoutes)

app.get('/', (req, res) => res.send('Hello World'))

// listener
app.listen(port)
