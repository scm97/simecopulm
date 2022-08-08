const multer = require('multer');
/* var util = require('util'); */

const storage = multer.diskStorage({
    destination: function( req, file, cb ) {
        const pathStorage = `${__dirname}/../storage`;
        cb(null,pathStorage);
    },
    filename: function( req, file, cb ) {  //TODO: caso1.mp3
        const ext = file.originalname.split(".").pop();  //TODO ["caso1", "mp3"]
        const filename = `file-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const uploadMiddleware = multer({storage});
/* const uploadFilesMiddleware = util.promisify(updloadMiddleware); */

module.exports = uploadMiddleware;