const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { validateInputUser } = require('../middlewares/inputValidation.middleware');

router.get('/:id?', userController.getUsers);
router.post('/', validateInputUser, userController.postUsers);
router.patch('/:id', validateInputUser,userController.editUsers);
router.delete('/:id', userController.deleteUsers);

module.exports = router;
