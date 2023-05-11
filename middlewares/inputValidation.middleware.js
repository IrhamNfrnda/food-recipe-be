const { check, validationResult } = require('express-validator')

const validateInputUser = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .isLength({ min: 6, max: 50 })
    .withMessage('Email must be between 6 and 50 characters long'),
  check('fullname')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters long'),
  check('phoneNumber')
    .notEmpty().withMessage('Phone Number is required')
    .isLength({ min: 6, max: 13 })
    .withMessage('Phone Number must be between 6 and 13 characters long'),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: errors.array()[0].msg
      })
    }
    return next()
  }
]

const validateInputRecipe = [
  check('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 6, max: 50 })
    .withMessage('Title must be between 3 and 50 characters long'),
  check('ingredients')
    .notEmpty().withMessage('Ingredients is required')
    .isLength({ min: 6 })
    .withMessage('Ingredients must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: errors.array()[0].msg
      })
    }
    return next()
  }
]

module.exports = {
  validateInputUser,
  validateInputRecipe
}
