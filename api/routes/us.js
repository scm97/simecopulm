const express = require('express');
const router = express.Router();
const customHeader = require('../middleware/customHeader');
const USController = require('../controllers/USController');
const EvalController = require('../controllers/EvalController');
const SimController = require('../controllers/SimController')

//TODO http://localhost:3000/us

router.get('/', USController.getCase);

router.post('/', USController.setCase);

router.get('/training', USController.showImage);

/* router.post('/saveEval', USController.saveEval); */

router.get('/eval', EvalController.getEval);

router.post('/eval/register', EvalController.registerEval);

router.get('/eval/finish', EvalController.finishEval);

router.post('/eval/diagnostic', EvalController.saveDiagnostic);

router.post('/eval/mark', EvalController.saveMark);

router.get('/eval/show', EvalController.showEval);

router.get('/eval/list', EvalController.getEvals);

router.post('/type', SimController.arduino_mode);

module.exports = router;