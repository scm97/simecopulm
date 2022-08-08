const handleHttpError = require("../utils/handleError");

/**
 * Array con los roles permitidos por la ruta
 * @param {*} role 
 * @returns 
 */
const checkRole = (role) => (req, res, next) => {
    try {
        
        const user  = req.body.user;
        
        const userRole = user.role;

        const checkValueRole = role.some((rolSingle) => userRole.includes(rolSingle)); //TODO: devuelve boolean basandose en si userRole coincide dentro del array de roles permitidos

        if(!checkValueRole) {
            handleHttpError(res, "USER_NOT_PERMISSIONS", 403);
            return
        }
        next();
    } catch (e) {
        handleHttpError(res, "ERROR_CHECK_ROLE", 403);
    }
}


module.exports = checkRole;