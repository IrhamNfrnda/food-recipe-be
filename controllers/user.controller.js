const users = require('../models/user.model')

const getUsers = async (req, res) => {
    try {
        const { id } = req.params
        const { page, limit } = req.query

        if (id) {
            const dataSelectedUser = await users.getUserByID({ id })

            res.status(200).json({
                status: true,
                message: "Get data success",
                data: dataSelectedUser,
              });
        } else {
            let dataAllUsers

            if (page && limit) {
                dataAllUsers = await users.getAllUsersPagination({ page, limit })
            } else {
                dataAllUsers = await users.getAllUsers()
            }
            
            if (dataAllUsers.length > 0) {
                res.status(200).json({
                    status: true,
                    message: "Get data success",
                    total: dataAllUsers.length,
                    page: page,
                    limit: limit,
                    data: dataAllUsers,
                  });
            } else {
                res.status(200).json({
                    status: true,
                    message: "User Data is Empty!",
                  });
            }  
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error in Server",
          });
    }
}

const postUsers = async (req, res) => {
    try {
        const {
            email,
            fullname,
            phoneNumber,
            password,
            profilePicture
        } = req.body
        
        const checkEmail = await users.getUserByEmail({email})

        if ( checkEmail.length > 0) {
            return res.status(401).json({
                status: false,
                message: "Email already registered!",
              });           
        }

        const createUser = await users.createUser({ email, 
                                                    fullname, 
                                                    phoneNumber, 
                                                    password, 
                                                    profilePicture })
         res.status(200).json({
            status: true,
            message: "Success Insert Data!",
            data: createUser
            });

    } catch (error) {
        res.status(500).json({
        status: false,
        message: "Error in Server",
        });
    }
}

const editUsers = async (req, res) => {
    try {
        const { id } = req.params
        const {
            email,
            fullname,
            phoneNumber,
            password,
            profilePicture
        } = req.body

        const userData = await users.getUserByID({ id })

        if (email !== userData[0].email) {
            const checkEmail = await users.getUserByEmail({ email })
            if (checkEmail.length > 0) {
                return res.status(401).json({
                    status: false,
                    message: "Email already registered!",
                  });   
            }
        }

        if (userData) {
            const updateUser = await users.updateUser({ id, 
                                     email, 
                                     fullname, 
                                     phoneNumber, 
                                     password,
                                     profilePicture,
                                     userData: userData[0]})

            return res.status(200).json({
                status: true,
                message: "Success Update Data!",
                data: updateUser
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

const deleteUsers = async (req, res) => {
    try {
        const { id } = req.params

        const deleteUser = await users.deleteUser({ id })

        res.status(200).json({
            status: true,
            message: "Success Delete Data!",
            data: deleteUser
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error in Server",
            });
    }
}

module.exports = {
    getUsers,
    postUsers,
    editUsers,
    deleteUsers
}