const db = require('../database')

// Function to get all recipes
// Receive with three parameters (page, sort, keyword)
// And if the params exist, it will be change the query
const getAllRecipes = async (params) => {

  let query = await db`SELECT * FROM recipes ORDER BY id DESC`

  const data = await query

  const fullCount = await db`SELECT COUNT(*) FROM recipes`

  return [{ full_count: fullCount[0].count }, ...data]
}

const getAllRecipesWithSort = async (params) => {
  const { sort } = params
  
  if (sort === 'asc') {
    query = await db`SELECT * FROM recipes ORDER BY id ASC`
  } else {
    query = await db`SELECT * FROM recipes ORDER BY id DESC`
  }

  const data = await query

  const fullCount = await db`SELECT COUNT(*) FROM recipes`

  return [{ full_count: fullCount[0].count }, ...data]
}

const getAllRecipesWithKeyword = async (params) => {
  const { keyword } = params

  if (keyword) {
    query = await db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`})`
  }

  const data = await query

  const fullCount = await db`SELECT COUNT(*) FROM recipes`

  return [{ full_count: fullCount[0].count }, ...data]
}

const getAllRecipesWithPage = async (params) => {
  const { page } = params

  if (page && !Number.isNaN(page) && page > 0) {
    query = await db`SELECT * FROM recipes ORDER BY id LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  }

  const data = await query

  const fullCount = await db`SELECT COUNT(*) FROM recipes`

  return [{ full_count: fullCount[0].count }, ...data]
}

const getAllRecipesWithSortAndKeyword = async (params) => {
  const { sort, keyword } = params

  if (sort === 'asc' && keyword) {
    query = await db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`}) ORDER BY id ASC`
  } else  {
    query = await db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`}) ORDER BY id DESC`
  }

  const data = await query

  const fullCount = await db`SELECT COUNT(*) FROM recipes`

  return [{ full_count: fullCount[0].count }, ...data]
}

const getAllRecipesWithSortAndPage = async (params) => {
  const { sort, page } = params

  if (sort === 'asc' && page && !Number.isNaN(page) && page > 0) {
    query = await db`SELECT * FROM recipes ORDER BY id ASC LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  } else {
    query = await db`SELECT * FROM recipes ORDER BY id DESC LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  }

  const data = await query

  const fullCount = await db`SELECT COUNT(*) FROM recipes`

  return [{ full_count: fullCount[0].count }, ...data]

}

const getAllRecipesWithKeywordAndPage = async (params) => {
  const { keyword, page } = params

  if (keyword && page && !Number.isNaN(page) && page > 0) {
    query = await db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`}) ORDER BY id LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  }

  const data = await query

  const fullCount = await db`SELECT COUNT(*) FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`})`

  return [{ full_count: fullCount[0].count }, ...data]
}

const getAllRecipesWithSortAndKeywordAndPage = async (params) => {
  const { sort, keyword, page } = params

  if (sort === 'asc' && keyword && page && !Number.isNaN(page) && page > 0) {
    query = await db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`}) ORDER BY id ASC LIMIT ${10} OFFSET ${
      10 * (page - 1)
    }`
  } else {
    query = await db`SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER(${`%${keyword}%`}) ORDER BY id DESC LIMIT ${10} OFFSET ${
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

const getRecipeBySlug = async (params) => {
  const { slug } = params

  const query = await db`SELECT * FROM recipes WHERE slug = ${slug}`

  return query
}

const getRecipeByUserID = async (params) => {
  const { id } = params

  const query = await db`SELECT * FROM recipes WHERE user_id = ${id}`

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
    videoLink,
    userId
  } = params

  const slug = title?.toLowerCase()?.split(" ").join("-")

  const payload = {
    recipe_picture: recipePicture,
    title,
    ingredients,
    video_link: videoLink,
    user_id: userId,
    slug
  }

  const query = await db`INSERT INTO recipes ${db(
    payload,
    'recipe_picture',
    'title',
    'ingredients',
    'video_link',
    'user_id',
    'slug'
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
  getRecipeBySlug,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeByTitle,
  getRecipeByUserID,
  getAllRecipesWithSort,
  getAllRecipesWithKeyword,
  getAllRecipesWithPage,
  getAllRecipesWithSortAndKeyword,
  getAllRecipesWithSortAndPage,
  getAllRecipesWithKeywordAndPage,
  getAllRecipesWithSortAndKeywordAndPage
}
