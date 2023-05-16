const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2;
const users = require('../models/user.model')

// Configuration 
cloudinary.config({
  cloud_name: "dv4s7dbf2",
  api_key: "249775284565762",
  api_secret: "dCWcJShZYwdq4wd2NA2JYTFKk7E"
});

function getToken (req) {
  const token = req?.headers?.authorization?.slice(
    7,
    req?.headers?.authorization?.length
  )

  return token
}

// function to get user data
// using jwt token
const getProfile = async (req, res) => {
  try {
    const decoded = jwt.verify(getToken(req), process.env.PRIVATE_KEY)

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
    const {
      email, fullname, phoneNumber, profilePicture, password
    } = req.body

    const decoded = jwt.verify(getToken(req), process.env.PRIVATE_KEY)

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

// Function to update photo profile
// Using cloudinary
const updatePhotoProfile = async (req, res) => {
  try {
    const { photo } = req.files

    // Check if file is empty
    if (!photo) {
      return res.status(400).json({
        status: false,
        message: 'Photo is required!'
      })
    }

    // Check if file is image
    // using mimetype
    // accepted file is jpg, jpeg, png, webp
    const acceptedType = /jpg|jpeg|png|webp/
    const checkType = acceptedType.test(photo.mimetype)

    if (!checkType) {
      return res.status(400).json({
        status: false,
        message: 'File must be image!'
      })
    }

    // Check if file size > 2MB
    if (photo.size > 2000000) {
      return res.status(400).json({
        status: false,
        message: 'File must be less than 2MB!'
      })
    }

    // Verify token and get id
    const decoded = jwt.verify(getToken(req), process.env.PRIVATE_KEY)
    const dataSelectedUser = await users.getUserByID({ id: decoded.id })

    // // Upload file to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(photo.tempFilePath, {public_id: "profilePicture" + decoded.id})

    // Update user data
    const user = await users.updateUser({
      id: decoded.id,
      profilePicture: uploadResponse.secure_url,
      userData: dataSelectedUser[0]
    })

    // Remove password from user data
    delete user[0].password

    return res.status(200).json({
      status: true,
      message: 'Success update your photo profile!',
      data: user
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
  updateProfile,
  updatePhotoProfile
}
