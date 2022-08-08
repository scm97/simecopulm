/* const { validationResult } = require("express-validator");
const {check} = require("express-validator");

const validatorUploadCase = [
    check("title").exists().notEmpty(),
    check("description").exists().notEmpty(),
    (req, res, next) => {
        try {
            validationResult(req).throw();
            return next();
        } catch (err) {
            res.status(403);
            res.send({ errors: err.array() })
        }
    }
];

module.exports = { validatorUploadCase }; */