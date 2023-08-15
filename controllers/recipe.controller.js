const recipes = require('../models/recipe.model')
const users = require('../models/user.model')
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

const getRecipesBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const dataSelectedRecipe = await recipes.getRecipeBySlug({ slug });

    if (!dataSelectedRecipe.length) {
      return res.status(404).json({
        status: false,
        message: 'Recipe Not Found!',
      });
    }

    // Get comments for the recipe
    const recipeId = await dataSelectedRecipe[0].id;
    const comments = await recipes.getCommentsByRecipeID(recipeId);

    // Include comments in the response
    const recipeWithComments = {
      ...dataSelectedRecipe[0],
      comments: comments || [], 
    };

    return res.status(200).json({
      status: true,
      message: 'Get data success',
      data: recipeWithComments,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



// Get recipes by user id
const getRecipesByUserID = async (req, res) => {
  try {
    const { id } = req.params

    if (Number.isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: 'ID must be integer'
      })
    }

    const dataSelectedRecipe = await recipes.getRecipeByUserID({ id })

    if (!dataSelectedRecipe.length) {
      return res.status(200).json({
        status: false,
        message: 'User ID Not Found!'
      })
    }

    return res.status(200).json({
      status: true,
      message: 'Get data success',
      data: dataSelectedRecipe
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

// Post recipes
const postRecipes = async (req, res) => {
  try {
    const {
      title,
      category,
      ingredients,
      videoLink,
      userId
    } = req.body

    const { recipePicture } = req.files

    // Check if user id is in database
    const checkUserId = await users.getUserByID({ id: userId })

    if (!checkUserId.length) {
      return res.status(401).json({
        status: false,
        message: 'User ID Not Found!'
      })
    }

    const checkTitle = await recipes.getRecipeByTitle({ title })

    if (checkTitle.length > 0) {
      return res.status(401).json({
        status: false,
        message: 'Title already Used!'
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

    // Upload file to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(recipePicture.tempFilePath, {public_id: "recipePicture" + title, folder: "recipePicture"})

    const createRecipe = await recipes.createRecipe({
      recipePicture: uploadResponse.secure_url,
      title,
      category,
      ingredients,
      videoLink,
      userId
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

const postComment = async (req, res) => {
  try {
    const { userId, recipeId, comment } = req.body;

    // Check if user exists
    const user = await users.getUserByID({ id: userId });
    if (!user.length) {
      return res.status(401).json({
        status: false,
        message: 'User not found!'
      });
    }

    // Check if recipe exists
    const recipe = await recipes.getRecipeByID({ id: recipeId });
    if (!recipe.length) {
      return res.status(404).json({
        status: false,
        message: 'Recipe not found!'
      });
    }

    // Post the comment
    const newComment = await recipes.postComment({userId, recipeId, comment});

    return res.status(200).json({
      status: true,
      message: 'Comment posted successfully!',
      data: newComment
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

const likeRecipe = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming you're sending userId in the request body
    const { id: recipeId } = req.params;

    const recipe = await recipes.getRecipeByID({ id: recipeId });
    if (!recipe.length) {
      return res.status(404).json({
        status: false,
        message: 'Recipe Not Found!',
      });
    }

    // Check if the user has already liked the recipe
    const existingLike = await recipes.checkRecipeLike({ userId, recipeId });
    if (existingLike.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'You have already liked this recipe!',
      });
    }

    // Like the recipe
    await recipes.likeRecipe({ userId, recipeId });

    // Get updated like count
    const likeCount = await recipes.getLikeCount({ recipeId });

    return res.status(200).json({
      status: true,
      message: 'Recipe liked successfully!',
      likeCount: likeCount,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const unlikeRecipe = async (req, res) => {
  try {
    const { userId } = req.body; 
    const { id: recipeId } = req.params;

    const recipe = await recipes.getRecipeByID({ id: recipeId });
    if (!recipe.length) {
      return res.status(404).json({
        status: false,
        message: 'Recipe Not Found!',
      });
    }

    // Check if the user has already liked the recipe
    const existingLike = await recipes.checkRecipeLike({ userId, recipeId });
    if (existingLike.length === 0) {
      return res.status(400).json({
        status: false,
        message: "You haven't liked this recipe!",
      });
    }

    // Unlike the recipe
    await recipes.unlikeRecipe({ userId, recipeId });

    // Get updated like count
    const likeCount = await recipes.getLikeCount({ recipeId });

    return res.status(200).json({
      status: true,
      message: 'Recipe unliked successfully!',
      likeCount: likeCount,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const saveRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Check if the recipe exists
    const recipe = await recipes.getRecipeByID({ id });
    if (!recipe.length) {
      return res.status(404).json({
        status: false,
        message: 'Recipe Not Found!',
      });
    }

    // Save the recipe
    await saveRecipe({ userId, recipeId: id });

    return res.status(200).json({
      status: true,
      message: 'Recipe saved successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}

const getSaved = async (req, res) => {
  try {
    const { userId } = req.user;

    // Get saved recipes for the user
    const savedRecipes = await getSavedRecipesByUserId(userId);

    return res.status(200).json({
      status: true,
      message: 'Saved recipes retrieved successfully!',
      data: savedRecipes,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}

module.exports = {
  getRecipes,
  getRecipesBySlug,
  getRecipesByUserID,
  postRecipes,
  editRecipes,
  deleteRecipes,
  editPhotoRecipe,
  postComment,
  likeRecipe,
  unlikeRecipe,
  saveRecipe,
  getSaved,
}
