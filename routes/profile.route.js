const router = require('express').Router()
const profileController = require('../controllers/profile.controller')
const { validateUpdateProfile } = require('../middlewares/inputValidation.middleware')
const { validateToken } = require('../middlewares/auth.middleware')

router.get('/', validateToken, profileController.getProfile)
router.patch('/', validateToken, validateUpdateProfile, profileController.updateProfile)
router.patch('/photo', validateToken, profileController.updatePhotoProfile)
router.delete('/photo', validateToken, profileController.deletePhotoProfile)

module.exports = router
