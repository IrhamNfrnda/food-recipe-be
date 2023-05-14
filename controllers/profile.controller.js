const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const users = require('../models/user.model')

// function to get user data
// using jwt token
const getProfile = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.slice(
      7,
      req?.headers?.authorization?.length
    )

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY)

    const user = await users.getUserByID({ id: decoded.id })

    // remove password from user data
    delete user[0].password

    return res.status(200).json({
      status: true,
      message: 'Success get your data!',
      data: user
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { authorization } = req.headers

    const { email, fullname, phoneNumber, profilePicture, password } = req.body

    const token = authorization?.slice(
      7,
      authorization?.length
    )

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY)

    const dataSelectedUser = await users.getUserByID({ id: decoded.id })

    if (email && email !== dataSelectedUser[0].email) {
      const checkEmail = await users.getUserByEmail({ email })
      if (checkEmail.length > 0) {
        return res.status(401).json({
          status: false,
          message: 'Email already registered!'
        })
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const updateUser = await users.updateUser({
      id: decoded.id,
      email,
      fullname,
      phoneNumber,
      password: hashedPassword,
      profilePicture,
      userData: dataSelectedUser[0]
    })

    // remove password from user data
    delete updateUser[0].password

    return res.status(200).json({
      status: true,
      message: 'Success update your data!',
      data: updateUser
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

module.exports = {
  getProfile,
  updateProfile
}
