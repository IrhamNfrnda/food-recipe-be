const recipes = require('../models/recipe.model')

const getRecipes = async (req, res) => {
    try {
        const { id } = req.params
        const { page, limit } = req.query

        if (id) {
            const dataSelectedRecipe = await recipes.getRecipeByID({ id })

            res.status(200).json({
                status: true,
                message: "Get data success",
                data: dataSelectedRecipe,
              });
        } else {
            let dataAllRecipes

            if (page && limit) {
                dataAllRecipes = await recipes.getAllRecipesPagination({ page, limit })
            } else {
                dataAllRecipes = await recipes.getAllRecipes()
            }
            
            if (dataAllRecipes.length > 0) {
                res.status(200).json({
                    status: true,
                    message: "Get data success",
                    total: dataAllRecipes.length,
                    page: page,
                    limit: limit,
                    data: dataAllRecipes,
                  });
            } else {
                res.status(200).json({
                    status: true,
                    message: "Recipes Data is Empty!",
                  });
            }  
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
          });
    }
}

const postRecipes = async (req, res) => {
    try {
        const { 
            recipePicture, 
            title, 
            ingredients, 
            videoLink 
        } = req.body;

        const checkTitle = await recipes.getRecipeByTitle({title})

        if ( checkTitle.length > 0) {
            return res.status(401).json({
                status: false,
                message: "Title already Used!",
              });           
        }

        const createRecipe = await recipes.createRecipe({ recipePicture, 
                                                        title, 
                                                        ingredients, 
                                                        videoLink})
         res.status(200).json({
            status: true,
            message: "Success Insert Data!",
            data: createRecipe
            });

    } catch (error) {
        res.status(500).json({
        status: false,
        message: error.message,
        });
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
        } = req.body;

        const recipeData = await recipes.getRecipeByID({ id })

        if (title !== recipeData[0].title) {
            const checkTitle = await recipes.getRecipeByTitle({ title })
            if (checkTitle.length > 0) {
                return res.status(401).json({
                    status: false,
                    message: "Title already Used!",
                  });   
            }
        }

        if (recipeData) {
            const updateRecipe = await recipes.updateRecipe({ id, 
                                     recipePicture, 
                                     title, 
                                     ingredients, 
                                     videoLink,
                                     recipeData: recipeData[0]})

            return res.status(200).json({
                status: true,
                message: "Success Update Data!",
                data: updateRecipe
            });

        } else {
            
            return res.status(401).json({
                status: false,
                message: "ID not found!",
            }); 
              
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            });
    }
}

const deleteRecipes = async (req, res) => {
    try {
        const { id } = req.params

        const deleteRecipe = await recipes.deleteRecipe({ id })

        res.status(200).json({
            status: true,
            message: "Success Delete Data!",
            data: deleteRecipe
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            });
    }
}

module.exports = {
    getRecipes,
    postRecipes,
    editRecipes,
    deleteRecipes
}