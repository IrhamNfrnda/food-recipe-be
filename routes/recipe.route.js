const router = require('express').Router();
const recipeController = require('../controllers/recipe.controller');
const { validateInputRecipe } = require('../middlewares/inputValidation.middleware')

router.get('/:id?', recipeController.getRecipes);
router.post('/', validateInputRecipe, recipeController.postRecipes);
router.patch('/:id', validateInputRecipe, recipeController.editRecipes);
router.delete('/:id', recipeController.deleteRecipes);

module.exports = router;
