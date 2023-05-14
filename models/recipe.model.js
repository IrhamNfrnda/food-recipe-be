const db = require('../database')

// Function to get all recipes
// Receive with three parameters (page, sort, keyword)
// And if the params exist, it will be change the query
const getAllRecipes = async (params) => {
  const { page, sort, keyword } = params

  let query = db`SELECT * FROM recipes`

  if (keyword) {
    query = db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`})`
  }

  if (sort && sort === 'asc') {
    query = db`SELECT * FROM recipes ORDER BY id ASC`
  } else {
    query = db`SELECT * FROM recipes ORDER BY id DESC`
  }

  if (page) {
    query = db`SELECT * FROM recipes ORDER BY id LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  }

  if (sort && sort === 'asc' && page) {
    query = db`SELECT * FROM recipes ORDER BY id ASC LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  } else {
    query = db`SELECT * FROM recipes ORDER BY id DESC LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  }

  if (keyword && sort && sort === 'asc') {
    query = db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`}) ORDER BY id ASC`
  } else {
    query = db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`}) ORDER BY id DESC`
  }

  if (keyword && page) {
    query = db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`}) ORDER BY id LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  }

  if (keyword && sort && sort === 'asc' && page) {
    query = db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`}) ORDER BY id ASC LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  } else {
    query = db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`}) ORDER BY id DESC LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  }

  const data = await query

  const fullCount = await db`SELECT COUNT(*) FROM recipes`

  return [{ full_count: fullCount[0].count }, ...data]
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
