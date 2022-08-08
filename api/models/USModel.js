var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FrameSchema = new Schema({
 /*   yaw: {
    type: Number,
    required: 'Kindly enter the yaw coordinate of the image'
  },
  pitch: {
    type: Number,
    required: 'Kindly enter the pitch coordinate of the image'
  },
  roll: {
    type: Number,
    required: 'Kindly enter the roll coordinate of the image'
  },  */
  zone: {
    type: Number,
    required: 'Kindly enter the zone coordinate of the image'
  },
  case: {
    type: String,
  },
  path: {
    type: String,
  },
  img: {
    data: Buffer, 
    contentType: String
  },
  order: {
    type: Number
  },
  eval: {
    type: Boolean
  },
},
  {   
    timestamps:true, //TODO createdAt, updatedAt
    versionKey:false
});

module.exports = mongoose.model('Frames', FrameSchema);
