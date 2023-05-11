const db = require('../database')

const getAllRecipes = async (params) => {
  const { page, sort, keyword } = params
  // let query = db`SELECT *, count(*) OVER() AS full_count FROM recipes`
  // if (keyword) {
  //   query += ` WHERE LOWER(recipes.name) LIKE LOWER(${keyword})`
  // }

  // if (page && !Number.isNaN(id)) {
  //   query += ` LIMIT 10 OFFSET ${10 * (page - 1)}`
  // }

  // if (sort && sort.toLowerCase() === 'asc') {
  //   query += ` ORDER BY id ASC`
  // } else {
  //   query += ` ORDER BY id DESC`
  // }

  let query
    // let sort = db`DESC`
  const isPaginate =
    page &&
    !Number.isNaN(page) &&
    parseInt(page) >= 1

  // check if sort type exist and paginate exist
  if (sort?.toLowerCase() === 'asc') {
    if (isPaginate) {
      sortQuery = db`ASC LIMIT 10 OFFSET ${10 * (parseInt(page) - 1)}`
    } else {
      sortQuery = db`ASC`
    }
  }

  // check if sort type not exist and paginate exist
  if (isPaginate && !sort) {
    sortQuery = db`DESC LIMIT 10 OFFSET ${10 * (parseInt(page) - 1)}`
  }

  if (keyword) {
    query =
      await db`SELECT *, count(*) OVER() AS full_count FROM recipes WHERE LOWER(recipes.title) LIKE LOWER(${keyword}) ORDER BY id ${sortQuery}`
  } else {
    query =
      await db`SELECT *, count(*) OVER() AS full_count FROM recipes ORDER BY id ${sortQuery}`
  }

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
