// import / intial
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors')
const userRoutes = require("./routes/user.route")
const recipeRoutes = require("./routes/recipe.route")
require('dotenv').config()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// use cors
app.use(cors())

// parse application/json
app.use(bodyParser.json());

app.use('/user', userRoutes)
app.use('/recipe', recipeRoutes)

app.get("/", function (req, res) {
  res.send("Hello World");
});

// listener
app.listen(3000, () => {
  console.log("App running in port 3000");
});