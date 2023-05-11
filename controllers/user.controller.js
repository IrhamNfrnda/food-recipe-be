const bcrypt = require('bcrypt')
const users = require('../models/user.model')

const getUsers = async (req, res) => {
  try {
    const { id } = req.params
    const { page, limit } = req.query

    if (id) {
      if (Number.isNaN(id)) {
        return res.status(400).json({
          status: false,
          message: 'ID must be integer'
        })
      }

      const dataSelectedUser = await users.getUserByID({ id })

      if (!dataSelectedUser.length) {
        return res.status(200).json({
          status: false,
          message: 'ID Not Found!'
        })
      }

      return res.status(200).json({
        status: true,
        message: 'Get Data Success!',
        data: dataSelectedUser
      })
    }
    let dataAllUsers

    if (page && limit) {
      dataAllUsers = await users.getAllUsersPagination({ page, limit })
    } else {
      dataAllUsers = await users.getAllUsers()
    }

    if (dataAllUsers.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Get data success',
        total: dataAllUsers.length,
        page,
        limit,
        data: dataAllUsers
      })
    }
    return res.status(200).json({
      status: true,
      message: 'User Data is Empty!'
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

const postUsers = async (req, res) => {
  try {
    const {
      email,
      fullname,
      phoneNumber,
      password,
      profilePicture
    } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const checkEmail = await users.getUserByEmail({ email })

    if (checkEmail.length > 0) {
      return res.status(401).json({
        status: false,
        message: 'Email already registered!'
      })
    }

    const createUser = await users.createUser({
      email,
      fullname,
      phoneNumber,
      password: hashedPassword,
      profilePicture
    })
    return res.status(200).json({
      status: true,
      message: 'Success Insert Data!',
      data: createUser
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error in Server'
    })
  }
}

const editUsers = async (req, res) => {
  try {
    const { id } = req.params
    const {
      email,
      fullname,
      phoneNumber,
      password,
      profilePicture
    } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: 'ID must be integer'
      })
    }

    const dataSelectedUser = await users.getUserByID({ id })

    if (!dataSelectedUser.length) {
      return res.status(200).json({
        status: false,
        message: 'ID Not Found!'
      })
    }

    if (email !== dataSelectedUser[0].email) {
      const checkEmail = await users.getUserByEmail({ email })
      if (checkEmail.length > 0) {
        return res.status(401).json({
          status: false,
          message: 'Email already registered!'
        })
      }
    }

    if (dataSelectedUser) {
      const updateUser = await users.updateUser({
        id,
        email,
        fullname,
        phoneNumber,
        password: hashedPassword,
        profilePicture,
        userData: dataSelectedUser[0]
      })

      return res.status(200).json({
        status: true,
        message: 'Success Update Data!',
        data: updateUser
      })
    }
    return null
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

const deleteUsers = async (req, res) => {
  try {
    const { id } = req.params

    if (Number.isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: 'ID must be integer'
      })
    }

    const deleteUser = await users.deleteUser({ id })

    if (!deleteUser.length) {
      return res.status(200).json({
        status: false,
        message: 'ID Not Found!'
      })
    }

    return res.status(200).json({
      status: true,
      message: 'Success Delete Data!',
      data: deleteUser
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

module.exports = {
  getUsers,
  postUsers,
  editUsers,
  deleteUsers
}
