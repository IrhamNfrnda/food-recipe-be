const jwt = require('jsonwebtoken')

const validateToken = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    res.status(401).json({
      status: false,
      message: 'Token empty, please use token for using this route'
    })
  }

  const token = authorization?.slice(
    7,
    authorization?.length
  )

  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({
        status: false,
        message: 'Invalid token, please use correctly token'
      })
    } else {
      next()
    }
  })
}

// Middleware to check if role is admin
const validateAdmin = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    res.status(401).json({
      status: false,
      message: 'Token empty, please use token for using this route'
    })
  }

  const token = authorization?.slice(
    7,
    authorization?.length
  )

  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({
        status: false,
        message: 'Invalid token, please use correctly token'
      })
    } else if (decoded.role == '1') {
      next()
    } else {
      console.log(decoded)
      res.status(403).json({
        status: false,
        message: 'Access Denied! You are not admin'
      })
    }
  })
}

module.exports = {
  validateToken,
  validateAdmin
}
