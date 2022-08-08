// Setup
require("dotenv").config()
mongoose = require('mongoose');
const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  
app.listen(port);

app.set('query parser', 'simple')

const cors = require('cors');

require('./config/database');

console.log('Server started on: ' + port);


//Middleware
app.use(express.json({limit: '200mb'}));
app.use(express.static('storage'));
//app.use(cors({origin: 'http://localhost:4200'}));
app.use(cors({origin: '*'}));

// Routes
app.use('/', require('./routes/routes_index'));


//Sonda US
const ImageMode = require('./controllers/USController')
const UploadMode = require('./controllers/CaseController')

var dgram = require('dgram');
var s = dgram.createSocket('udp4');
s.on('message', function(msg, rinfo) {
  console.log('I got this message: ' + msg.toString());
  //res = JSON.parse(msg);
  zone = msg.toString();

  /* //Cambiar los pitch por yaw y roll
  var sensibility_yaw = 2;
  var sensibility_pitch = 2;
  var sensibility_roll = 2;

  //yaw = operar180(res.yaw , offset_yaw);//res.roll; //operar180(res.roll , offset_yaw);
  yaw = res.yaw - offset_yaw; 
  var yaw_up = Math.round((yaw + sensibility_yaw)*10)/10;
  var yaw_dw =  Math.round((yaw - sensibility_yaw)*10)/10;
  yaw_up = ImageMode.correctYaw(yaw_up);
  yaw_dw = ImageMode.correctYaw(yaw_dw);

  //pitch = operar180(res.pitch , offset_pitch);// res.roll; //operar180(res.roll , offset_yaw);
  pitch = res.pitch - offset_pitch;
  var pitch_up =  Math.round((pitch + sensibility_pitch)*10)/10;
  var pitch_dw =  Math.round((pitch - sensibility_pitch)*10)/10;
  pitch_up = ImageMode.correctPitch(pitch_up);
  pitch_dw = ImageMode.correctPitch(pitch_dw);

  //roll = operar180(res.roll , offset_roll);//  res.roll; //operar180(res.roll , offset_yaw);
  roll = res.roll - offset_roll; 
  var roll_up =  Math.round((roll + sensibility_roll)*10)/10;
  var roll_dw =  Math.round((roll - sensibility_roll)*10)/10;
  roll_up = ImageMode.correctYaw(roll_up);
  roll_dw = ImageMode.correctYaw(roll_dw);
  
  //console.log('Readjusted positions: '+ yaw + ', ' + pitch +', ' + roll + '\n');
  //console.log('yaw_up ' + yaw_up + 'yaw_dw ' + yaw_dw + '\n'); */

   /*  ImageMode.showingImage(yaw_up, yaw_dw, pitch_up, pitch_dw, roll_up, roll_dw, yaw, pitch, roll); */

    console.log(zone)
    ImageMode.showingVideo(zone);

    /* UploadMode.record_coord(yaw, pitch, roll); */

});
/* s.bind(3000);

//RED LOCAL
var url_arduino = '192.168.137.69';

//WIFI GBT
//var url_arduino = '138.4.10.154';
function intervalFunc() { //igual convendría definir la funcion en controllers
  s.send(Buffer.from('eco'), 3000, url_arduino); //ip del arduino (no cambiar)
}

setInterval(function(){
  intervalFunc();
}, 200); */

console.log('ApiUS RESTful API server started on: ' + port);
 

//--------------------------------------------
//---------CODE TO OBTAIN OFFSET--------------
//--------------------------------------------
//calStep = 'calibrating_0';
var y = [], p = [], r = [];
var i = 0;
var offset_yaw = 0, offset_pitch = 0, offset_roll = 0;
var origin_y = 69, origin_p = 74, origin_r = 58; 


function calibrateFunc1(){
  if(ImageMode.calStep != 'calibrating_1'){
    return
  }else{
    // Con el código de debajo se pretende eliminar datos que se alejen de los demás. PROBLEMA, SOLO COMPARAMOS CON EL ANTERIOR.
    //Seria mejor despues de hacer la media quitar los que se alejen de la media. Se puede pero el código sería mas lioso porque habria que hacer la media, quitar los valores alejados del array y volver a calcular una nueva media.
    //console.log('calibrando 1...:\n'+y[i-1] + '      ' + yaw);

    if (yaw>(y[i-1]+2)||yaw<(y[i-1]-2)||pitch>(p[i-1]+2)||pitch<(p[i-1]-2)||roll>(r[i-1]+2)||roll <(r[i-1]-2)){
      //console.log(yaw + ", " + pitch + ", " + roll + ": " +"Value out of boundaries");
    }
    else{
    y.push(yaw);
    p.push(pitch);
    r.push(roll);
    i++;
    }
    //console.log(y +'// ' + p + '// ' + r);
  }
}

function calibrateFunc2() {
  if(ImageMode.calStep != 'calibrating_2'){
    return
  }
  else{
    console.log('Dentro del segundo paso de calibracion');
    var sum_y = 0, sum_p=0, sum_r=0;
    var mean_y = 0, mean_p=0, mean_r=0;
    //Meter código para comprobar que hay el mismo numero de yaw que de pitch y de roll (con un .length), la cuestion es que hacer si no es así??
    for (i = 0; i< Math.min(y.length, p.length, r.length);i++){
      sum_y += y[i], sum_p += p[i], sum_r += r[i];
    }
    mean_y = Math.round((sum_y/y.length)*100)/100;
    mean_p = Math.round((sum_p/p.length)*100)/100;
    mean_r = Math.round((sum_r/r.length)*100)/100;

    //console.log('\n media: ' + mean_y + ', ' + mean_p + ', ' + mean_r)

    offset_yaw =mean_y - origin_y, offset_pitch = mean_p - origin_p , offset_roll = mean_p - origin_p;
    console.log('\n Offset: ' + offset_yaw + ', ' + offset_pitch + ', ' + offset_roll );
    ImageMode.calStep = 'calibration_finished';
  }
}


//Arriba se le resta el offset a cada valor de yaw pitch y roll
//-----------------------------------
//-----------------------------------