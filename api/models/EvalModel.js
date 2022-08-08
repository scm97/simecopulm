var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EvalSchema = new Schema({
  idUser: {
    type: String,
    required: true
  },
  case: {
    type: String,
    required: true
  },
  patternsC: {
    type:Array
  },
  patternsI: {
    type:Array
  },
  diagnosticC: {
    type: String
  },
  diagnosticI: {
    type: String
  },
  mark: {
    type: Number
  },
},
  {   
    timestamps:true, //TODO createdAt, updatedAt
    versionKey:false
  }
);

module.exports = mongoose.model('Evaluations', EvalSchema);