const recipes = require('../models/recipe.model')

const getRecipes = async (req, res) => {
  try {
    const { id } = req.params
    const { page, sort, keyword } = req.query

    if (id) {
      if (Number.isNaN(id)) {
        return res.status(400).json({
          status: false,
          message: 'ID must be integer'
        })
      }
      const dataSelectedRecipe = await recipes.getRecipeByID({ id })

      if (!dataSelectedRecipe.length) {
        return res.status(200).json({
          status: false,
          message: 'ID Not Found!'
        })
      }

      return res.status(200).json({
        status: true,
        message: 'Get data success',
        data: dataSelectedRecipe
      })
    }

    dataAllRecipes = await recipes.getAllRecipes({
      page,
      sort,
      keyword
    })

    if (dataAllRecipes.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Get data success',
        total: dataAllRecipes.length,
        page: !Number.isNaN(page)? {
          current: page,
          total: dataAllRecipes?.[0].full_count
          ? Math.ceil(parseInt(dataAllRecipes?.[0]?.full_count) / 10)
          : 0
        } : null,
        data: dataAllRecipes
      })
    }
    return res.status(200).json({
      status: false,
      message: 'Recipes Data is Empty!'
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

const postRecipes = async (req, res) => {
  try {
    const {
      recipePicture,
      title,
      ingredients,
      videoLink
    } = req.body

    const checkTitle = await recipes.getRecipeByTitle({ title })

    if (checkTitle.length > 0) {
      return res.status(401).json({
        status: false,
        message: 'Title already Used!'
      })
    }

    const createRecipe = await recipes.createRecipe({
      recipePicture,
      title,
      ingredients,
      videoLink
    })

    return res.status(200).json({
      status: true,
      message: 'Success Insert Data!',
      data: createRecipe
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

const editRecipes = async (req, res) => {
  try {
    const { id } = req.params
    const {
      recipePicture,
      title,
      ingredients,
      videoLink
    } = req.body

    if (Number.isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: 'ID must be integer'
      })
    }
    const dataSelectedRecipe = await recipes.getRecipeByID({ id })

    if (!dataSelectedRecipe.length) {
      return res.status(200).json({
        status: false,
        message: 'ID Not Found!'
      })
    }

    if (title !== dataSelectedRecipe[0].title) {
      const checkTitle = await recipes.getRecipeByTitle({ title })
      if (checkTitle.length > 0) {
        return res.status(401).json({
          status: false,
          message: 'Title already Used!'
        })
      }
    }

    if (dataSelectedRecipe) {
      const updateRecipe = await recipes.updateRecipe({
        id,
        recipePicture,
        title,
        ingredients,
        videoLink,
        recipeData: dataSelectedRecipe[0]
      })

      return res.status(200).json({
        status: true,
        message: 'Success Update Data!',
        data: updateRecipe
      })
    }
    return null
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

const deleteRecipes = async (req, res) => {
  try {
    const { id } = req.params

    if (Number.isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: 'ID must be integer'
      })
    }
    const deleteRecipe = await recipes.deleteRecipe({ id })

    if (!deleteRecipe.length) {
      return res.status(200).json({
        status: false,
        message: 'ID Not Found!'
      })
    }

    return res.status(200).json({
      status: true,
      message: 'Success Delete Data!',
      data: deleteRecipe
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

module.exports = {
  getRecipes,
  postRecipes,
  editRecipes,
  deleteRecipes
}
