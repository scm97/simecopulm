const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../utils/handleStorage');
const casesController = require ('../controllers/CaseController');
const authMiddleware = require('../middleware/session');

//TODO http://localhost/3000/storage

//router.post('/', uploadMiddleware.single('video'), authMiddleware, casesController.uploadCase);

router.get('/', casesController.showCases);

router.get('/assigned', casesController.showAssignedCases);

router.get('/title', casesController.getTitle);

router.get('/title/id', casesController.getTitle2);

router.delete('/delete/:id', casesController.deleteCase);

router.post('/upload', uploadMiddleware.single('image'),casesController.createCase);

router.get('/upload/record', casesController.record);

router.post('/upload/images', uploadMiddleware.single('file'), casesController.saveCaseImages);

module.exports = router;