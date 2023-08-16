const router = require('express').Router()
const recipeController = require('../controllers/recipe.controller')
const { validateInputRecipe } = require('../middlewares/inputValidation.middleware')
const { validateToken } = require('../middlewares/auth.middleware')
// const { getRecipesRedis} = require('../middlewares/redis.middleware')

router.get('/:id?', recipeController.getRecipes)
router.get('/detail/:slug?', recipeController.getRecipesBySlug)
router.get('/user/:id?', recipeController.getRecipesByUserID)
router.post('/', validateToken, validateInputRecipe, recipeController.postRecipes)
router.patch('/:id', validateToken, validateInputRecipe, recipeController.editRecipes)
router.delete('/:id', validateToken, recipeController.deleteRecipes)
router.patch('/photo/:id', validateToken, recipeController.editPhotoRecipe)
router.post('/comment', validateToken, recipeController.postComment)
router.post('/like', validateToken, recipeController.likeRecipe);
router.post('/unlike', validateToken, recipeController.unlikeRecipe);
router.post('/save', validateToken, recipeController.saveRecipe);
router.post('/unsave', validateToken, recipeController.unsaveRecipe);

module.exports = router
