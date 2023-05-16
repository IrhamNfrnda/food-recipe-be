const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const users = require('../models/user.model')

// Funvtion to login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exist
    const checkUser = await users.getUserByEmail({ email })

    if (checkUser.length < 1) {
      return res.status(401).json({
        status: false,
        message: 'Email or Password is wrong'
      })
    }

    // Compare password
    const comparePassword = await bcrypt.compare(
      password,
      checkUser[0].password
    )

    if (!comparePassword) {
      return res.status(401).json({
        status: false,
        message: 'Email or Password is wrong'
      })
    }

    // Create token
    const token = jwt.sign(
      {
        id: checkUser[0].id,
        email: checkUser[0].email,
        role: checkUser[0].role
      },
      process.env.PRIVATE_KEY
    )

    return res.status(200).json({
      status: true,
      message: 'Success Login!',
      data: {
        token
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

// Function to register user
const register = async (req, res) => {
  try {
    const {
      email, fullname, phoneNumber, password, role
    } = req.body

    // Check if user exist
    const checkUser = await users.getUserByEmail({ email })

    if (checkUser.length > 0) {
      return res.status(401).json({
        status: false,
        message: 'Email already used!'
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const createUser = await users.createUser({
      email,
      fullname,
      phoneNumber,
      password: hashedPassword,
      role
    })

    return res.status(200).json({
      status: true,
      message: 'Success Register!',
      data: createUser
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

// Function to logout user
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      status: true,
      message: 'Success Logout!'
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

module.exports = {
  login,
  register,
  logout
}
