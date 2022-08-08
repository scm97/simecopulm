const handleHttpError = require('../utils/handleError');

var dgram = require('dgram');
const { showingVideo } = require('./USController');
const { strictEqual } = require('assert');
var s = dgram.createSocket('udp4');

s.bind(3000);

//RED LOCAL
var ip_arduino = '192.168.137.129'; //en teoría siempre la misma

//WIFI GBT
//var url_arduino = '138.4.10.154';
/* function intervalFunc() { //igual convendría definir la funcion en controllers
  s.send(Buffer.from('eco'), 3000, url_arduino); //ip del arduino (no cambiar)
} */

const ImageMode = require('../controllers/USController')
const UploadMode = require('../controllers/CaseController')

var handler_eco;
var handler_neumo;
var handler_derrame;

const arduino_mode =  function (req, res) {
        console.log(req.body)
        const type = req.body.type;
        console.log(type)
        s.on('message', function(msg, rinfo) {
          console.log('I got this message: ' + msg.toString());
          if (msg.includes('zone')) {
            res = JSON.parse(msg);
            zona = res.zone;
            console.log('ENVIANDO DATOS')
            ImageMode.showingVideo(zona);
          }
        })
          if (type === 'eco' && !handler_neumo) {
             handler_eco = setInterval(function(){
              console.log('ECO')
              s.send(Buffer.from('eco'), 3000, ip_arduino);
            }, 500);             
         }
         if ((type === 0 || type === 'neumo') && !handler_neumo) {
            console.log('neumo')
            clearInterval(handler_eco)
            clearInterval(handler_derrame)
            handler_eco = null;
            handler_derrame = null;
            handler_neumo = setInterval(function(){
              console.log('NEUMO')
              s.send(Buffer.from('neumo'), 3000, ip_arduino);
            }, 1000); 
        }
        if ((type === 1 || type === 'derrame') && !handler_derrame) {
            console.log('derrame')
            clearInterval(handler_eco)
            clearInterval(handler_neumo)
            handler_eco = null;
            handler_neumo = null;
            handler_derrame = setInterval(function(){
              console.log('DERRAME')
              s.send(Buffer.from('derrame'), 3000, ip_arduino);
            }, 1000); 
        }
        if (type === 2 || type === 'off') {
            clearInterval(handler_eco)
            clearInterval(handler_neumo)
            clearInterval(handler_derrame)
            handler_eco = null;
            handler_neumo = null;
            handler_derrame = null;
            s.send(Buffer.from('off'), 3000, ip_arduino);
            console.log('OFF')
        } 
}


module.exports = {arduino_mode};