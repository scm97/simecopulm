var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CaseSchema = new Schema({
    name: {
        type: String,
        //required: true
      },
      imPath: {
        type: String,
        //required: true
      },
      title: {
        type: String,
        unique:true,
        required: true
      },
      description: {
        type: String,
      },
      type: {
        //0: Neumotórax
        //1: Derrame torácico
        //2: Otro
        type: Number,
        required: true
      },
      diagnostic: {
        //0: Membrana hialina
        //1: Taquipnea transitoria
        //2: Síndrome aspiración meconial
        //3: Displasia broncopulmonar
        //4: Neumotórax
        //5: Condensación/Atelactasia
        //6: Derrame pleural
        type: String,
        required: true
      },
      patterns: {
        type: Array
      },
      img_eval: {
        type: String,
        ref: "Frames",
        required: false
      }
},
    {   
        timestamps:true, //TODO createdAt, updatedAt
        versionKey:false
    }
);


module.exports = mongoose.model('Cases', CaseSchema);