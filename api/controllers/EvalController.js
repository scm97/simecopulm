var mongoose = require('mongoose');
const { userInfo } = require('os');
const CaseModel = require('../models/CaseModel');
const EvalModel = require('../models/EvalModel');
const handleHttpError = require('../utils/handleError');
require('../models/EvalModel'),
require('../models/CaseModel'),
require('../models/USModel')
var currentEvalId1,
buttPress


var Eval = mongoose.model('Evaluations');
var Case = mongoose.model('Cases');
var Image = mongoose.model('Frames');



const getEval = async (req,res) => {
  try {
    eval_id = req.query.eval_id;
    const data = await EvalModel.find({"_id": eval_id})
    res.send(data)
  } catch (e) {
    handleHttpError(res, "ERROR_GET_EVAL", 400)
  } 
}

/* 
 *registra la evaluacion. Crea el perfil para el alumno y el caso seleccionados
*/

const registerEval = async (req, res) => {
  try {
    var eval = new Eval({
      idUser: req.body.user,
      case: req.body.caso,
      patternsC: req.body.patternsC,
      patternsI: req.body.patternsI,
      mark: req.body.mark
    })
    console.log('EVAL: '+eval)
    const data = await EvalModel.create(eval);
    res.send(data);
  } catch (e) {
    handleHttpError(res, "ERROR_REGISTER_EVAL", 400) ;
  }
}

const getEvals = async (req,res) => {
  try {
    user_id = req.query._id;
    const data = await EvalModel.find({idUser: user_id})
    res.send(data)
  } catch (e) {
  handleHttpError(res, "ERROR_GET_EVALS", 400) ;
  }
}

const saveDiagnostic = async (req, res) => {
  try {
    console.log(req.body)
    eval_id = req.body.eval_id;
    diagnosticC = req.body.diagnosticC;
    diagnosticI = req.body.diagnosticI;
    const data = await EvalModel.updateOne({"_id": eval_id}, {"diagnosticC": diagnosticC, "diagnosticI": diagnosticI})
    console.log(data)
    res.send(data)
  } catch (e) {
    handleHttpError(res, "ERROR_SAVE_DIAG", 400)
  }
}

const saveMark = async (req, res) => {
  try {
    console.log(req.body)
    eval_id = req.body.eval_id;
    mark = req.body.mark;
    const data = await EvalModel.updateOne({"_id" : eval_id}, {"mark" : mark})
    console.log(data)
    res.send(data)
  } catch (e) {
    handleHttpError(res, "ERROR_SAVE_MARK", 400)
  }
}


const showEval = async (req, res) => {
  console.log(req)
  const caso = await CaseModel.findById(req.query)
  const eval = await EvalModel.findById(req.query)
  res.send({caso, eval});
}

/* 
 *finaliza el registro de la evaluacion
*/
const finishEval = function(req, res){
  console.log('he entrado en finishEval')
  if(currentEvalId1 != null){
    console.log('evalId en finish antes: ' + currentEvalId1)
    currentEvalId1 = null;
    console.log('evalId en finish despues: ' + currentEvalId1)
    console.log('ha terminado el registro de la eval')
  }
  res.send();
};

/* 
 *marca las imagenes que el alumno quiere guardar en el entrenamiento
*/
const selectEval = function(req, res){
  console.log('selectEval en evalcontroller: ');
  buttPress = true;
  console.log('button pulsado ' + buttPress);
  res.send();
}

//se puede borrar???
const deleteEval = function(req, res){
  Eval.remove({},
    function(err, image){
      if(err)
        res.send(err);
      res.json({message: 'Evaluation successfully deleted'});
    });
};

/* 
 *obtiene las evaluaciones en funcion del alumno, del caso y de la fecha
*/
const getEvaluations = function(req, res){
  var resultado = {};
  console.log('hemos entrado en getEvaluations: ', req.body.usuario)
  Eval.find({"idUser" : req.body.usuario},
  function(err, result){
    if(err) throw err;
    if(result){
      for(var i=0; i<result.length; i++){
      //console.log('este es el resultadito: ', result)
        idsCases[i] =  result[i].case;
      }
      resultado.resultadoEval = result;

        console.log('aqui', idsCases)
        Case.find({"_id" : { $in : idsCases }},
        function(err, result){
          if(err) throw err;
          if(result){
            console.log('el case find me da....: ', result)
          
            resultado.resultadoCaso = result;

            res.send(resultado)
        }})
    }});
};

/* 
 *muestra las evaluaciones seleccionadas por el profesor
*/
const showEvaluations = function(req, res){

  Case.find({"_id" : req.body.caseEval},
  function(err, result){
    if(err)  throw err;
    if(result){
      imgSaved = result[0].img_eval; 
      imgSaved = imgSaved.split(',');
      caseTitle = result[0].title;
      //console.log('imag asociadas a la eval: ' + imgSaved)
      //console.log('este es el titulo del caso: ', caseTitle)

      Image.find({$and: [
      { "order" : { $in : imgSaved }},
      { "case" : caseTitle}]},
      function(err, result){
        if(err)  throw err;
        if(result){
          //console.log(result);

          resultadoFinal.imagEval= result;
          //console.log('ya tengo las imagenes que pertenecen a la evaluacion')

          for(var i=0; i<result.length; i++)
          imgId [i]= result[i]._id;
          //console.log('estos son los id asociados a las imagenes: ' + imgId)
          
          EvalCoord.find({
          $and: [ {"evalId" : req.body.idEval},
          {"image" : { $in : imgId }},
          {"butt" : true}]},
          function(err, result){
            if(err) throw err;
            if(result){
            
              //console.log('estas son las imag encontradas: ')
              //console.log(result)
            
              var ev_saved = [];
              for(var j=0; j<result.length; j++)
              ev_saved [j] = result[j].image;
              console.log('ev_saved: ' + ev_saved)


              Image.find({
                "_id" : { $in : ev_saved }
              },
              function(err, result){
                if(err) throw err;
                if(result){
                  //console.log('aqui encuentro el path de las imag encontradas')
                  //console.log(result)

                  resultadoFinal.imagVistas = result;
                  res.json(resultadoFinal);
                  
                }
              }
              )
            }
          });
        }
      })
    }
  }
);

}

/* 
 *calcula la nota obtenida por el alumno tras el entrenamiento y la almacena en base de datos
*/
const obtainMark = function(req, res){
  var notaObtenida;
  notaObtenida = (resultadoBueno.imagenesVistas.length/resultadoBueno.imagenesEval.length)*100;
  Eval.updateOne({"_id" : currentEvalId2}, {"mark" : notaObtenida},
  function(err, result){
    if(err) throw err;
    if(result){
      console.log('hemos actualizado la nota ', result)
      res.send();
  }})
}

/* 
 *calcula la media de todas las notas obtenidas por los alumnos para un mismo caso
*/
const getAverage = function(req, res){
  console.log('getAverage en controller', req.body)
  Eval.find({"case" : req.body.idCase},
  function(err, result){
    if(err) throw err;
    if(result){
      console.log('resultado del average ', result)
      res.send(result)     
  }})
}

module.exports = {registerEval, getEvals, showEval, saveMark, saveDiagnostic, getEval,
  deleteEval, obtainMark, 
  getAverage, getEvaluations, 
  finishEval, selectEval, 
  getEvaluations, showEvaluations}