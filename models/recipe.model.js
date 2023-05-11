const db = require('../database')

const getAllRecipes = async () => {
  const query = await db`SELECT * FROM recipes ORDER BY id`

  return query
}

const getRecipeByID = async (params) => {
  const { id } = params

  const query = await db`SELECT * FROM recipes WHERE id = ${id}`

  return query
}

const getAllRecipesPagination = async (params) => {
  const { limit, page } = params

  const query = await db`SELECT * FROM recipes ORDER BY id LIMIT ${limit} OFFSET ${limit * (page - 1)} `

  return query
}

const createRecipe = async (params) => {
  const {
    recipePicture,
    title,
    ingredients,
    videoLink
  } = params

  const payload = {
    recipe_picture: recipePicture,
    title,
    ingredients,
    video_link: videoLink
  }

  const query = await db`INSERT INTO recipes ${db(
    payload,
    'recipe_picture',
    'title',
    'ingredients',
    'video_link'
  )} returning *`

  return query
}

const updateRecipe = async (params) => {
  const {
    id,
    recipePicture,
    title,
    ingredients,
    videoLink,
    recipeData
  } = params

  const payload = {
    recipe_picture: recipePicture ?? recipeData.recipe_picture,
    title: title ?? recipeData.title,
    ingredients: ingredients ?? recipeData.ingredients,
    video_link: videoLink ?? recipeData.video_link
  }

  const query = await db`UPDATE recipes set ${db(
    payload,
    'recipe_picture',
    'title',
    'ingredients',
    'video_link'
  )} WHERE id = ${id} returning *`

  return query
}

const deleteRecipe = async (params) => {
  const { id } = params

  const query = await db`DELETE FROM recipes WHERE id = ${id} returning *`

  return query
}

const getRecipeByTitle = async (params) => {
  const { title } = params

  const query = await db`SELECT * FROM recipes WHERE title = ${title}`

  return query
}

module.exports = {
  getAllRecipes,
  getAllRecipesPagination,
  getRecipeByID,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeByTitle
}
