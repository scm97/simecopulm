var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const CasesModel = require('../models/CaseModel');
var impath,
  vidpath,
  selectedCase,
  calStep = 'calibrating_0',
  strDopplerStat,
  dopplerStat,
  imageResult,
  caso,
  user,
  patterns,
  zone,
  coords = {};

var Ev = require('./EvalController');
var Image = mongoose.model('Frames');


/* corrige los valores de yaw y roll proporcionados por el sensor
  *@param {number} yaw
  *@return {number}
*/
const correctYaw = function (yaw) {
  if(yaw > 180){
    yaw = -180 + (yaw - 180);
  }
  if(yaw < -180){
    yaw = 180 + (yaw + 180);
  }
  return yaw;
};

/* corrige los valores de pitch proporcionados por el sensor
  *@param {number} pitch
  *@return {Object}
*/
const correctPitch = function(pitch) {
  if(pitch > 90){ 
    pitch = 90 - (pitch - 90);
  }
  else if (pitch < - 90){
    pitch = -90 - (pitch + 90);
  }
  return pitch;
};

const showingVideo = function(zone) {
  console.log("ZONA: ", zone)
  console.log("************")
  if (selectedCase) {
    Image.find({
    $and: [ { "zone": zone }, 
    { "case": selectedCase._id }]},
    { "vidpath":1,"path":1, "_id":1},
    function(err, result){
      //console.log(result)
      if(err)  throw err;
      if (result != ''){
        console.log('AAAAAAAAAAAAAAAAAAa')
        console.log(result[0]);
        //console.log(selectedCase);
        impath = JSON.stringify(result[0].path);
        vidpath = JSON.stringify(result[0].vidpath);
        imageResult = result[0];
        
      }else{
        //////////////////////////////////////////////////////////////////////////////////////////////////
          impath = JSON.stringify("background/background.mp4");
          imageResult = null;    
      }}
    ).limit(1);
    
  /*   if (imageResult)       
          Ev.register_eval_coord(yaw, pitch, roll, imageResult); */
  }}       
;


/* obtiene las imagenes asociadas a las coord correspondientes
  *@param {number} yaw_up, yaw_dw, pitch_up, pitch_dw, roll_up, roll_dw, yaw, pitch, roll
  *@return {number}
*/
/*
const showingImage = function(yaw_up, yaw_dw, pitch_up, pitch_dw, roll_up, roll_dw, yaw, pitch, roll) {

//console.log("AAAAAAAAAAAAAAAAAAAAAAAAA", selectedCase.title)
console.log(yaw, pitch, roll)
if(selectedCase){
 CasesModel.find({"_id" : selectedCase},
  function(err, result){
    if(err)  throw err;
    if (result){
      var caseTitle = result[0].title;

    Image.find({
    $and: [ { "yaw": {$gte: yaw_dw, $lt: yaw_up} }, 
    { "pitch": {$gte: pitch_dw, $lt: pitch_up} },
    { "roll": {$gte: roll_dw, $lt: roll_up} },
    { "case": caseTitle }]},
    { "vidpath":1,"path":1, "_id":1},
    function(err, result){
      if(err)  throw err;
      if (result != ''){
        console.log(result[0]);
        console.log(selectedCase);
        impath = JSON.stringify(result[0].path);
        vidpath = JSON.stringify(result[0].vidpath);
        imageResult = result[0];
        
      }else{
        //////////////////////////////////////////////////////////////////////////////////////////////////
        Image.find({
          $and: [ { "yaw": {$gte: yaw_dw - 5, $lt: yaw_up + 5} }, 
          { "pitch": {$gte: pitch_dw - 5, $lt: pitch_up + 5} },
          { "roll": {$gte: roll_dw - 5, $lt: roll_up + 5} },
          { "case": caseTitle }]},
          { "vidpath":1,"path":1, "_id":1},
          function(err, result){
            if(err)  throw err;
            if (result != ''){
              console.log(result[0]);
              impath = JSON.stringify(result[0].path);
              vidpath = JSON.stringify(result[0].vidpath);
              imageResult = result[0];
        
            }else{
              var r = Math.floor(Math.random() * 10 + 1);
              impath = JSON.stringify("background/registro"+r+".jpg");  
              vidpath = JSON.stringify("../../assets/videos/adult/nosignal.jpg"); 
              impath = JSON.stringify("background/background.mp4");
              imageResult = null;
          }}).limit(1);
        /////////////////////////////////////////////////////////////////////////////////////////////////
    }}
    ).limit(1);
    
    if (imageResult)       
          Ev.register_eval_coord(yaw, pitch, roll, imageResult);
  }})          
}}; */

 const showVideo = function (req, res) {
  res.send(vidpath);
}; 

const showImage = function(req, res) {
  res.send(impath);
};


/* 
 *selecciona el caso elegido
*/
const setCase = function(req, res){
  console.log('setCase', req.body)
  caso = req.body.case;
  user = req.body.user;
  //console.log(caso);
  //console.log(usr);
  /* selectedCase = (req.body.case);

  res.send(selectedCase);
  console.log(selectedCase); */
};

/* 
 *registro de la evaluacion
*/
const saveEval = function(req, res){
  console.log('saveEval', req.body)
  Ev.registerEval(caso, patterns, user);
  //console.log(caso)
  //console.log(usr)
  res.send();
}

/* 
 *obtiene el caso elegido
*/
const getCase = async function(req, res){
  console.log(req.query.casoId)
  //req.query = JSON.stringify(req.query)
  selectedCase = await CasesModel.findOne({_id: req.query.casoId});
  console.log("el getCase de node: " + selectedCase);
  res.send(selectedCase)
 /* res.json(selectedCase); */
}


module.exports.calStep = calStep;

module.exports = {correctYaw, correctPitch, showingVideo, showVideo, showImage, setCase, saveEval, getCase}


