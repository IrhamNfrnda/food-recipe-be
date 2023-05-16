const router = require('express').Router()
const recipeController = require('../controllers/recipe.controller')
const { validateInputRecipe } = require('../middlewares/inputValidation.middleware')
const { validateToken } = require('../middlewares/auth.middleware')

router.get('/:id?', recipeController.getRecipes)
router.post('/', validateToken, validateInputRecipe, recipeController.postRecipes)
router.patch('/:id', validateToken, validateInputRecipe, recipeController.editRecipes)
router.delete('/:id', validateToken, recipeController.deleteRecipes)
router.patch('/photo/:id', validateToken, recipeController.editPhotoRecipe)

module.exports = router
