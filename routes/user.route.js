const router = require('express').Router()
const userController = require('../controllers/user.controller')
const { validateInputUser } = require('../middlewares/inputValidation.middleware')
const { validateAdmin } = require('../middlewares/auth.middleware')

router.get('/:id?', validateAdmin, userController.getUsers)
router.post('/', validateAdmin, validateInputUser, userController.postUsers)
router.patch('/:id', validateAdmin, validateInputUser, userController.editUsers)
router.delete('/:id', validateAdmin, userController.deleteUsers)

module.exports = router
