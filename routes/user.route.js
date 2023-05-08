const router = require('express').Router()
const userController = require('../controllers/user.controller')

router.get('/:id?', userController.getUsers)
router.post('/', userController.postUsers)
router.patch('/:id', userController.editUsers)
router.delete('/:id', userController.deleteUsers)

module.exports = router