var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
      type: String,
      required: true
  },
  surnames: {
      type: String,
      required: true
  },
  username: {
      type: String,
      required: true,
      unique: true
  },
  email: {
    type:String,
    required:true,
    unique:true
  },
  password: {
      type: String,
      required: true,
      minlength : [4, 'Password must be at least 4 character long'],
      //select: false
  }, 
  role: {
      // 0: Docente
      // 1: Alumno
      type: Number,
      required: true
  },
  assignedTeacher: {
      type: String
  },
  assignedCases:{
    type: Array
  },
},
    {   
        timestamps:true, //TODO createdAt, updatedAt
        versionKey:false
    }
);

module.exports = mongoose.model('Users', UserSchema);