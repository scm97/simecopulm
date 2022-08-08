const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

/** Devuelve token
 * Pasar objeto del usuario
 * @param {*} user 
 */
const tokenSign = async (user) => {
    const sign = await jwt.sign(
        {
            _id: user._id,
            role: user.role,
        },
        JWT_SECRET,
        {
            expiresIn:"2h",
        }
    );
    return sign;
};


/**
 * Pasar el token de sesion el JWT
 * @param {*} tokenJwt 
 * @returns 
 */

const verifyToken = async (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, JWT_SECRET)
    } catch (e) {
        return null
    }
};

module.exports = { tokenSign, verifyToken };