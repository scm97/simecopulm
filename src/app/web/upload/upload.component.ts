import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/upload.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  providers: [UploadService]
})
export class UploadComponent implements OnInit {

  files:any = [];
  frames: any = [];
  recCoord:any = [];
  images: any = [];
  videoId = 'video';
  scaleFactor = 1;

  readonly POPUP_STR_IMG = "Por favor, introduzca una imagen";
  readonly POPUP_IMG_FORMAT = 'Por favor, introduzca la imagen con el formato adecuado'
  readonly POPUP_STR_VID = "Por favor, introduzca un video";
  readonly POPUP_VID_MP4 = 'Por favor, introduzca el video en formato MP4';
  readonly POPUP_STR_PATT = "Por favor pulse el botón de OK para añadir los sucesos antes de continuar";
  readonly POPUP_TITLE = 'Ya existe un caso con el mismo título. Por favor, introduzca otro distinto'
  readonly SUCCESS_PATT = "Sucesos añadidos correctamente";
 
  list: Array<any> = [
    { name: 'Línea pleural', value: 'Línea pleural' },
    { name: 'Deslizamiento pleural', value: 'Deslizamiento pleural' },
    { name: 'Líneas A', value: 'Líneas A' },
    { name: 'Líneas B aisladas', value: 'Líneas B aisladas' },
    { name: 'Líneas B coalescentes', value: 'Líneas B coalescentes'},
    { name: 'Colapso subpleural', value: 'Colapso subpleural'},
    { name: 'Colapso alveolar', value: 'Colapso alveolar'},
    { name: 'Derrame torácico', value: 'Derrame torácico'},
    { name: 'Neumotórax', value: 'Neumotórax'},
    { name: 'Ninguno de los anteriores', value: 'Ninguno'}
  ];

  diagnostics: Array<any> = [
    {name:'Enfermedad de membrana hialina', value: 'Enfermedad de membrana hialina'},
    {name:'Taquipnea transitoria del recién nacido', value: 'Taquipnea transitoria del recién nacido'},
    {name:'Síndrome de aspiración meconial', value: 'Síndrome de aspiración meconial'},
    {name:'Displasia broncopulmonar', value: 'Displasia broncopulmonar'},
    {name:'Neumotórax', value: 'Neumotórax'},
    {name:'Condensación/Atelectasias', value: 'Condensación/Atelectasias'},
    {name:'Derrame Torácico', value: 'Derrame Torácico'},
    {name: 'Otro', value: 'Otro'}
  ];

  form: FormGroup;

  case_form = {
    title: '',
    description: '',
    image: null, 
    type: '',
    patterns:[],
    diagnostic:''
  };


  constructor(private uploadService: UploadService, 
    private router: Router, 
    private _snackBar: MatSnackBar,
    private fb: FormBuilder) 
    { 
      this.form = this.fb.group({
        checkArray: this.fb.array([])
      })
    }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm) {
    console.log('upload del componente, imprimo el titulo del caso: ', this.case_form.title);
    console.log(this.case_form)
    if(this.case_form.image && this.case_form.patterns.length > 0) { 
    this.uploadService.readFile(this.case_form.image).then((res:any)=>{
      console.log(res);
      this.case_form.image = res;
      console.log(this.case_form)
      this.uploadService.submitFile(this.case_form).subscribe((res:any) => {
        console.log(res)
        this.router.navigate(['/record-coord'], {queryParams: { case: JSON.stringify(this.case_form)}});
      },
      err => {
        console.log(err)
        this.openSnackBar(this.POPUP_TITLE, " X")
        window.location.reload()
      })
      
    });
  }else{
    if(!this.case_form.image){
      this.openSnackBar(this.POPUP_STR_IMG, "X");
    }
    /* if(this.files.length <= 0){
      this.openSnackBar(this.POPUP_STR_VID, "X");
    } */
    if(this.case_form.patterns.length <= 0) {
      this.openSnackBar(this.POPUP_STR_PATT, "X")
    }
  }
}

openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 3000,
  });
}

onCheckboxChange(e:any) {
  const checkArray: FormArray = this.form.get('checkArray') as FormArray;
  if (e.target.checked) {
    checkArray.push(new FormControl(e.target.value));
  } else {
    let i: number = 0;
    checkArray.controls.forEach((item: any) => {
      if (item.value == e.target.value) {
        checkArray.removeAt(i);
        return;
      }
      i++;
    });
  }
}


checklist() {
  console.log(this.form.value)
  this.case_form.patterns = this.form.value.checkArray;
  this.openSnackBar(this.SUCCESS_PATT, "✓")
}



/**
 * Carga la imagen subida
 * @param event 
 */
  uploadImage(event:any) {
    const imagenCapturada = event.target.files[0];
    if (imagenCapturada.type === 'image/jpeg' || imagenCapturada.type === 'image/png' || imagenCapturada.type === 'image/jpg') {
      this.images.push(imagenCapturada)
      this.case_form.image = imagenCapturada
    } else {
      this.openSnackBar(this.POPUP_IMG_FORMAT, " X")
    }
   
    console.log('estamos en upload ' , imagenCapturada)
  }

/**
 * Carga el vídeo subido
 * @param event 
 */

  uploadFile(event:any, zone:any) {
    console.log('estoy en uploadvideo', event, zone)
    //for(var i=0; i<event.target.files.length;i++) {
      const videoCapturado = event.target.files[0];
      const zona = zone;
      if (videoCapturado.type === 'video/mp4') {
        this.files.push(videoCapturado)
        console.log('estamos en uploadfile ', videoCapturado)  
      } else {
        this.openSnackBar(this.POPUP_VID_MP4, " X")
      }
      //videoCapturado.zone = i+1;
      //console.log(videoCapturado)
    //}
    console.log(this.files, zona)
    this.getClips(this.files, zona)
  }

  getClips(files:any, zone:any) {
    var _this=this;
      return new Promise((resolve, reject) => {
        for (var j=0;j<files.length;j++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[j]);
        reader.onloadend = function() {
          var base64data = reader.result;
          var file = {zone: zone, file: base64data} //zone sale mal
          console.log(file)
          _this.frames.push(file)
          console.log(_this.frames)
        }
        }});
  }   

  deleteImage(index: any){
    this.images.splice(index, 1)
    this.case_form.image = null;
  }

  deleteAttachment(index:any) {
    this.files.splice(index, 1);
    this.frames.splice(index, 1);
    console.log(this.frames)
  }

  saveCaseImages(k: number){
    this.uploadService.saveCaseImages(this.frames[k]).subscribe(
      (res) => {
      console.log('result del saveCaseImages en el componente' , res); 
    });
  }

  goBack() {
      this.router.navigate(['/teacher'])
  }

  

  extractFrames() {
    console.log('estamos en extract frames')
    const _this = this;
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    var i = 0;
    
    function initCanvas(this: any, e:any) {
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      this.currentTime = i;
      console.log("INIT CANVAS")
    }
  
    function drawFrame(this: any, e: any) {
      this.pause();
      ctx?.drawImage(this, 0, 0);
     
      console.log("DRAW FRAME")
      console.log("i: ",i)
      console.log("currentTime: ",this.currentTime)

      canvas.toBlob(saveFrame2(i), 'image/jpg');
      if (this.currentTime < this.duration) {
        this.play();
      }

      // aqui incrementamos 0.8 seg
      i += 6.38/10;
    
      // if we are not passed end, seek to next interval
      if (i <= this.duration) {
          // this will trigger another seeked event
          this.currentTime = i;
      }
      else {
          // Done!, next action
      }
    }
  
    function saveFrame2(i: number) {
      return function(blob:any){
        console.log("saving frame: ", i)
        var reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
            var base64data = reader.result;                
            //console.log(base64data);
            var file = {order: i,file: base64data}
            _this.frames.push(file);
        }
      }
    }
  
     function revokeURL(this: any, e: any) {
      URL.revokeObjectURL(this.src);
    }
    
      function onend(this: any) {
      var img;
      _this.frames.sort((a:any,b:any) => {
        if (a.order > b.order) {
          return 1;
        }
        if (a.order < b.order) {
          return -1;
        }
        return 0;
      });
    }

      console.log('frames: ', _this.frames)
      // we don't need the video's objectURL anymore
      URL.revokeObjectURL(this.frames); //DUDAS
     

    console.log(this.files)
    video.addEventListener('loadedmetadata', initCanvas, false);
    video.addEventListener('seeked', drawFrame, false);
    video.addEventListener('ended', onend, false);
    
    video.src =  window.URL.createObjectURL(this.files[0]);
    video.play();
  }
}  