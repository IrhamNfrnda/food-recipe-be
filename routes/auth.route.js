const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const { validateInputUser } = require('../middlewares/inputValidation.middleware')
const { validateToken } = require('../middlewares/auth.middleware')

router.post('/register', validateInputUser, authController.register)
router.post('/login', authController.login)
router.post('/logout', validateToken, authController.logout)
router.get('/refresh_token', authController.refreshToken)
module.exports = router
