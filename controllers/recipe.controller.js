const recipes = require('../models/recipe.model')
const cloudinary = require('cloudinary').v2;
const { storeRecipesInRedis } = require('../middlewares/redis.middleware')

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

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

    let dataAllRecipes = []

    // Check if all query is empty
    if (!page && !sort && !keyword) {
      dataAllRecipes = await recipes.getAllRecipes()
    }

    // Check if sort is not empty
    if (sort) {
      dataAllRecipes = await recipes.getAllRecipesWithSort({ sort })
    }

    // Check if page is not empty
    if (page && !Number.isNaN(page) && page > 0) {
      dataAllRecipes = await recipes.getAllRecipesWithPage({ page })
    }

    // Check if keyword is not empty
    if (keyword) {
      dataAllRecipes = await recipes.getAllRecipesWithKeyword({ keyword })
    }

    // Check if sort and page is not empty
    if (sort && page && !Number.isNaN(page) && page > 0) {
      dataAllRecipes = await recipes.getAllRecipesWithSortAndPage({
        sort,
        page
      })
    }

    // Check if keyword and sort is not empty
    if (keyword && sort) {
      dataAllRecipes = await recipes.getAllRecipesWithSortAndKeyword({
        keyword,
        sort
      })
    }

    // Check if keyword and page is not empty
    if (keyword && page && !Number.isNaN(page) && page > 0) {
      dataAllRecipes = await recipes.getAllRecipesWithKeywordAndPage({
        keyword,
        page
      })
    }

    // Check if keyword, sort, and page is not empty
    if (keyword && sort && page && !Number.isNaN(page) && page > 0) {
      dataAllRecipes = await recipes.getAllRecipesWithSortAndKeywordAndPage({
        keyword,
        sort,
        page
      })
    }
    
    const totalData = dataAllRecipes?.length;
    // // Store data to redis
    // storeRecipesInRedis(dataAllRecipes, totalData);


    if (dataAllRecipes.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Get data success',
        total: dataAllRecipes.length,
        page: !Number.isNaN(page)
          ? {
              current: page,
              total: dataAllRecipes?.[0].full_count
                ? Math.ceil(parseInt(dataAllRecipes?.[0]?.full_count) / 10)
                : 0
            }
          : null,
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

const editPhotoRecipe = async (req, res) => {
  try {
    const { id } = req.params
    const { recipePicture } = req.files

    if (Number.isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: 'ID must be integer'
      })
    }

    // Check if file is empty
    if (!recipePicture) {
      return res.status(400).json({
        status: false,
        message: 'Photo is required!'
      })
    }

    // Check if file is image
    // using mimetype
    // accepted file is jpg, jpeg, png, webp
    const acceptedType = /jpg|jpeg|png|webp/
    const checkType = acceptedType.test(recipePicture.mimetype)

    if (!checkType) {
      return res.status(400).json({
        status: false,
        message: 'File must be image!'
      })
    }

    // Check if file size > 2MB
    if (recipePicture.size > 2000000) {
      return res.status(400).json({
        status: false,
        message: 'File must be less than 2MB!'
      })
    }

    const dataSelectedRecipe = await recipes.getRecipeByID({ id })

    if (!dataSelectedRecipe.length) {
      return res.status(200).json({
        status: false,
        message: 'ID Not Found!'
      })
    }
    // Upload file to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(recipePicture.tempFilePath, {public_id: "recipePicture" + id})

    const updateRecipe = await recipes.updateRecipe({
      id,
      recipePicture: uploadResponse.secure_url,
      recipeData: dataSelectedRecipe[0]
    })

    return res.status(200).json({
      status: true,
      message: 'Success Update Data!',
      data: updateRecipe
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
  deleteRecipes,
  editPhotoRecipe
}
