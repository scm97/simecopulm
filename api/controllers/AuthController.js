const {encrypt, compare} = require('../utils/handlePassword');
const {tokenSign} = require('../utils/handleJwt');
const UserModel = require('../models/UserModel');
const handleHttpError = require('../utils/handleError');

/**
 * Controlador que registra y asigna un jwt a usuario
 * @param {*} req 
 * @param {*} res 
 */
const register_token = async (req, res) => {
    
    try {
        const hashPassword = await encrypt(req.body.password);
        const a = {...req.body, password: hashPassword};
        const dataUser = await UserModel.create(a);
        dataUser.set('password', undefined, {strict: false});

        const data = {
            token: await tokenSign(dataUser),
            user:dataUser
        }
        res.send(data);

    } catch (e) {
        handleHttpError(res, "ERROR_REGISTER_TOKEN", 400);
    }
    
}

/**
 * Controlador para comparar las contraseñas y devolver el usuario con el token
 * @param {*} req 
 * @param {*} res 
 */
const login_token = async (req, res) => {
    console.log(req.body)
    console.log("PASSWORD: ", req.body.password)
    console.log("USERNAME: ", req.body.username)

    try {
        const user = await UserModel.findOne({username: req.body.username});
        console.log(user);
        
        if (!user) {
            handleHttpError(res, "USER_NOT_EXISTS", 404);
            return
        }
        const hashPassword = user.password;

        console.log("**************COMPARANDO PASSWORDS***************")
        console.log("PASSWORD ENVIADO: ", req.body.password)
        console.log("PASSWORD EN BBDD: ", hashPassword)
        console.log("***********************************************")

        const check = await compare(req.body.password, hashPassword);

        if (!check) {
            handleHttpError(res, "INVALID_PASSWORD", 401);
            return
        }

    user.set('password', undefined, {strict:false});

        const data = {
            token: await tokenSign(user),
            user
        }
        res.send(data);

    } catch (e) {
        console.log(e)
        handleHttpError(res, "ERROR_LOGIN_TOKEN",400);
    }
}


module.exports = {register_token, login_token}