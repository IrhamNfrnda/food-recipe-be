const router = require('express').Router();
const recipeController = require('../controllers/recipe.controller');

router.get('/:id?', recipeController.getRecipes);
router.post('/', recipeController.postRecipes);
router.patch('/:id', recipeController.editRecipes);
router.delete('/:id', recipeController.deleteRecipes);

module.exports = router;
