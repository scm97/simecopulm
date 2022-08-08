const handleHttpError = (res, message, code) => {
    res.status(code).send({error: message});
};

module.exports = handleHttpError;