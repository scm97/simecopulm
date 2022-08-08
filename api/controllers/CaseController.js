const CasesModel = require('../models/CaseModel');
const FramesModel = require('../models/USModel');
const mongoose = require('mongoose');
const fs = require('fs');
const handleHttpError = require('../utils/handleError');
const UserModel = require('../models/UserModel');
var recCoord = {};
var frameN = 0;
var framesIds = [];

var Frame = mongoose.model('Frames');


const showCases = async (req,res) => {
    const data = await CasesModel.find({});
    res.send({data});
}

const createCase = async (req, res) => {
    try {
      console.log('estoy en create case')
        const body = req.body;
        console.log(body);
        body.imPath = body.title+"/logo.jpeg";

        const caso = await CasesModel.create(body);
        console.log(caso)
        this.nombreCaso = caso.title;
        this.idCaso = caso._id;
        res.send({caso});
        
        fs.mkdirSync("storage/"+body.title, { recursive: true });
        var base64Data = body.image.replace(/^data:image\/jpeg;base64,/, "");
        fs.writeFileSync("storage/"+body.imPath, base64Data, 'base64');

    } catch (e) {
        handleHttpError(res, "ERROR_CREATE_CASE: "+ e, 400)
    }
}

/* 
 *envia las coord de yaw, pitch, roll para poder asociarlas a imagenes
*/
const record = function(req, res){
    console.log('rec en casecontroller');
    console.log('recCoord: ' , recCoord) 
    res.json(recCoord);
}

/* 
 *obtiene las coord de yaw, pitch, roll
*/
const record_coord = function(yaw, pitch, roll){
  recCoord.yaw=yaw;
  recCoord.pitch=pitch;
  recCoord.roll=roll;
}


/* 
 *guarda las imagenes del nuevo caso en el sistema
*/
const saveCaseImages = async (req, res) => {
    console.log('PINTO EL recCoord EN SAVE_CASES_IMAGES', recCoord, this.nombreCaso)
    console.log(req.body)
    //console.log("Res: "+res)
    
    const frame = new Frame()
    frame.zone = req.body.params.zone;
    //frameN += 1;
    frame.path= this.nombreCaso+"/clip"+frame.zone+".mp4"
    /* frame.yaw = recCoord.yaw;
    frame.pitch = recCoord.pitch;
    frame.roll = recCoord.roll; */
    frame.case = this.idCaso;
  
    //fs.mkdirSync("imagenes_casos/"+this.nombreCaso+"/entrenamiento", { recursive: true });
  
    var base64Data = req.body.params.file.replace(/^data:video\/mp4;base64,/, "");
      fs.writeFileSync("storage/"+frame.path, base64Data, 'base64');
    
      frame.save((err, doc) => {
        if (!err) {
          console.log('Imágenes registradas correctamente');
          res.send(frame);
        } else {
          console.log(err)
        } 
    }); 
  
    framesIds[frameN-1] = frame._id;
  
  }

  const deleteCase = async (req, res) => {
    try {
      console.log(req)
      const caso = await CasesModel.findById(req.params.id)
      fs.rmdir("storage/"+caso.title,{ recursive: true, force: true }, (err) => {
        if (err) {
          return console.log("error occurred in deleting directory", err);
        }
        console.log("Directory deleted successfully");
      });
      const data = await CasesModel.findByIdAndDelete({_id: req.params.id})
      console.log(data)
      res.send(data)
    } catch (e) {
      console.log(e)
      handleHttpError(res, "ERROR_DELETE_CASE", 400)
    }
  }

  const showAssignedCases = async (req, res) => {
    try {
      const data = await UserModel.findOne({username: req.query.username}, {"assignedCases":1, "_id":0})
      res.send(data)
    } catch (e) {
      handleHttpError(res, "ERROR_SHOW_ASSIGNED", 400)
    }
  }

  const getTitle = async (req, res) => {
    try {
      const data = await CasesModel.findById({_id : req.query.caso_id}, {"title":1})
      res.send(data)
    } catch (e) {
      handleHttpError(res, "ERROR_GET_TITLE", 400)
    }
  }

    const getTitle2 = async (req, res) => {
      try {
        console.log(req)
        const data = await CasesModel.findOne({title : req.query.casoT})
        console.log(data)
        res.send(data)
      } catch (e) {
        handleHttpError(res, "ERROR_GET_TITLE", 400)
      }

    }

  

module.exports = { showCases, 
  createCase, 
  record, 
  record_coord, 
  saveCaseImages, 
  deleteCase, 
  showAssignedCases, 
  getTitle, 
  getTitle2}