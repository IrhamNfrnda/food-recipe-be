const db = require('../database')

const getAllUsers = async () => {
    const query = await db`SELECT * FROM users`

    return query
}

const getUserByID = async (params) => {
    const { id } = params

    const query = await db`SELECT * FROM users WHERE id = ${id}`

    return query
}

const getAllUsersPagination = async (params) => {
    const { limit, page } = params

    const query = await db`SELECT * FROM users LIMIT ${limit} OFFSET ${limit * (page - 1)} `

    return query
}

const createUser = async (params) => {
    const { 
        email, 
        fullname, 
        phoneNumber,
        password, 
        profilePicture 
    } = params;

    const payload = {
        email,
        fullname,
        phone_number: phoneNumber,
        password,
        profile_picture: profilePicture,
      };

    const query = await db`INSERT INTO users ${db(
        payload,
        "email",
        "fullname",
        "phone_number",
        "password",
        "profile_picture"
      )} returning *`;

      return query
}

const updateUser = async(params) => {
    const { 
        id,
        email, 
        fullname, 
        phoneNumber,
        password, 
        profilePicture,
        userData 
    } = params;

    const payload = {
        email: email ?? userData.email,
        fullname: fullname ?? userData.fullname,
        phone_number: phoneNumber ?? userData.phone_number,
        password: password ?? userData.password,
        profile_picture: profilePicture ?? userData.profile_picture,
      };
    
      const query = await db`UPDATE users set ${db(
        payload,
        "email",
        "fullname",
        "phone_number",
        "password",
        "profile_picture"
      )} WHERE id = ${id} returning *`;

      return query

}

const deleteUser = async (params) => {
    const { id } = params

    const query = await db`DELETE FROM users WHERE id = ${id} returning *`

    return query
}

const getUserByEmail = async (params) => {
    const { email } = params

    const query = await db`SELECT * FROM users WHERE email = ${email}`

    return query
}

module.exports = {
    getAllUsersPagination,
    getAllUsers,
    getUserByID,
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail
  }