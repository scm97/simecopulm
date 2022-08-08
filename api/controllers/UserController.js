const userModel = require('../models/UserModel')
const mongoose = require('mongoose');
const handleHttpError = require('../utils/handleError');
const UserModel = require('../models/UserModel');
const CaseModel = require('../models/CaseModel')
const { async } = require('rxjs');


var dbUser = mongoose.createConnection('mongodb://localhost/SimEcoPulmonarDB');


dbUser.on('error', function(err){
  if(err) throw err;
});

dbUser.once('open', function callback () {
  console.info('Mongo db connected successfully');
});

/**
 * Obtener lista de usuarios
 * @param {*} req 
 * @param {*} res 
 */
const show_users = async (req, res) => {
    try {
        const user = req.query.username;
        const data = await userModel.find({});
        res.send({data, user});
    } catch (e) {
        handleHttpError(res, "ERROR_SHOW_USERS", 403);
    }
};

/**
 * Muestra alumnos
 * @param {*} req 
 * @param {*} res 
 */
const show_students = async (req,res) => {
    try {
        const user = req.query.username;
        const student = await userModel.find({role: 1})
        res.send({student, user});
    } catch (e) {
        handleHttpError(res, "ERROR_SHOW_STUDENTS", 400)
    }
}

/**
 * Muestra alumnos asignados
 * @param {*} req 
 * @param {*} res 
 */
const show_students_assigned = async (req,res) => {
    try {
        console.log(req.query)
        idTeacher = req.query.idTeacher
        const data = await userModel.find({assignedTeacher: idTeacher})
        res.send(data)
    } catch (e) {
        handleHttpError(res, "ERROR_SHOW_STUDENTS_ASSIGNED", 400)
    }
}


/**
 * Muestra docentes
 * @param {*} req 
 * @param {*} res 
 */

const show_teachers = async (req,res) => {
    try {
        const user = req.query.username;
        const teacher = await userModel.find({role: 0})
        res.send({teacher, user});
    } catch (e) {
        handleHttpError(res, "ERROR_SHOW_TEACHERS", 400)
    }
}


const user_role = async (req, res) => {
    try {
        console.log(req)
        const user = await userModel.findOne({username: req.body.user.username},{"role":1, "_id":0});
        const role = user.role;
        res.send({role})
    } catch (e) {
        handleHttpError(res, "ERROR_USER_ROLE" + e, 400);
    }
    
}

const user_profile = async (req, res) => {
    try {
        console.log(req)
        const user = await UserModel.findOne({user: req.body.user}, {"_id":0, "token":0, "password":0})
        res.send(user)
    } catch (e) {
        handleHttpError(res, "ERROR_USER_DESCRIPTION"+e, 400)
    }
}

const delete_user = async (req,res) => {
    try {
        console.log(req)
        const data = await UserModel.findByIdAndDelete({_id: req.params.id})
        console.log(data)
        res.send(data)
    } catch (e) {
        handleHttpError(res, "ERROR_DELETE_USER", 400)
    }
}


const assign_case = async (req, res) => {
    try {
        console.log(req)
        casoId = req.body.caso
        username = req.body.user
        const user = await UserModel.findOne({username: username})
        console.log(user)
        const caso = await CaseModel.findById(casoId)
        console.log(caso)
        if (!(user.assignedCases.includes(caso))){
            console.log('q pasa aqui')
            user.assignedCases.push(caso)
            console.log(user)
            const data = await UserModel.updateOne({"username":username}, user)
            console.log(data)
            res.send(data)
        } else {
            console.log('ya lo tiene')
        }
        
    } catch (e) {
        handleHttpError(res, "ERROR_ASSIGN_CASE", 400)
    }
}

const unassign_case = async (req,res) => {
    try {
        console.log(req.body)
        casoId = req.body.caso
        username = req.body.user
        const user = await UserModel.findOne({username: username})
        console.log(user)
        const caso = await CaseModel.findById(casoId)
        const casoTitle = caso.title
        const data = await UserModel.updateOne( user , { "$pull": { "assignedCases": { "title": casoTitle }}}, {upsert:true})
        console.log(data)
        res.send(data)
    } catch (e) {
        handleHttpError(res, "ERROR_UNASSIGN_CASE", 400)
    }
}

  
module.exports = {show_users, 
    show_students, 
    show_students_assigned, 
    show_teachers, 
    user_role, 
    user_profile, 
    delete_user,
    assign_case,
    unassign_case};

