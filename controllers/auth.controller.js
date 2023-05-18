const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const users = require('../models/user.model')

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.PRIVATE_KEY, { expiresIn: '1d' })
}

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.PRIVATE_KEY, { expiresIn: '1y' })
}

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
    const token = generateAccessToken({
      id: checkUser[0].id,
      email: checkUser[0].email,
      role: checkUser[0].role
    })

    const refreshToken = generateRefreshToken({
      id: checkUser[0].id,
      email: checkUser[0].email,
      role: checkUser[0].role
    })

    // Save refresh token to database
    await users.updateUser({ id: checkUser[0].id }, { refreshToken })

    
    return res.status(200).json({
      status: true,
      message: 'Success Login!',
      data: {
        token,
        refreshToken
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
      email, fullname, phoneNumber, password
    } = req.body

    // Check if user exist
    const checkUser = await users.getUserByEmail({ email })

    if (checkUser.length > 0) {
      return res.status(401).json({
        status: false,
        message: 'Email already used!'
      })
    }

    // Check if role is inputed
    if (req.body.role) {
      return res.status(401).json({
        status: false,
        message: 'You cannot input role!'
      })  
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const createUser = await users.createUser({
      email,
      fullname,
      phoneNumber,
      password: hashedPassword
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

// Function to refresh token
// Accept refresh token from client
// Check if refresh token is valid
// Create new access token
// Send new access token to client
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    // Check if refresh token is valid
    const checkRefreshToken = await users.getUserByRefreshToken({ refreshToken })

    if (checkRefreshToken.length < 1) {
      return res.status(401).json({
        status: false,
        message: 'Refresh token is not valid!'
      })
    }

    // Create new access token
    const token = generateAccessToken({
      id: checkRefreshToken[0].id,
      email: checkRefreshToken[0].email,
      role: checkRefreshToken[0].role
    })

    return res.status(200).json({
      status: true,
      message: 'Success Refresh Token!',
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



module.exports = {
  login,
  register,
  logout,
  refreshToken
}
