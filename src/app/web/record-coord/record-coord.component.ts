import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { UploadService } from '../../services/upload.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-record-coord',
  templateUrl: './record-coord.component.html',
  styleUrls: ['./record-coord.component.css']
})
export class RecordCoordComponent implements OnInit {

  public actualFrame = 0;
  frames: any = [];
  framesBuenas: any = [];
  case: any;

  zone1:any;
  zone2:any;
  zone3:any;
  zone4:any;
  zone5:any;
  zone6:any;

  filesD:any = [];
  filesI:any = [];

  i=0;

  readonly POPUP_STR = "Imagen guardada correctamente";
  readonly POPUP_VID_MP4 = 'Por favor, introduzca el video en formato MP4';
  readonly POPUP_VID_ZONES = 'Por favor, debe subir los clips de las 6 zonas para continuar';
  readonly POPUP_UPLOAD = 'Caso subido con éxito'

  constructor(
    private activatedRoute: ActivatedRoute, 
    private uploadService: UploadService, 
    private router: Router,
    private _snackBar: MatSnackBar) 
    { 
 
    }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
    this.case = JSON.parse(params['case']);
    this.frames = JSON.parse(params['frames']);
    console.log('case: ', this.case)
    console.log('frames ', this.frames);
  });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  uploadFile(event:any, zone:number) {
    console.log('estoy en uploadvideo', event, zone)
      const videoCapturado = event.target.files[0];
      const zona = zone;
      if (videoCapturado.type === 'video/mp4' && [1,2,3].includes(zona)) {
        this.filesD.push(videoCapturado)
        console.log('estamos en uploadfile derecho', videoCapturado)  
        if (zona===1){
          this.zone1 = videoCapturado;
          console.log(this.zone1, zona)
          this.getClips(this.zone1, zona) 
          this.i++
        }
        if (zona===2){
          this.zone2 = videoCapturado;
          console.log(this.zone2, zona)
          this.getClips(this.zone2, zona) 
          this.i++
        }
        if (zona===3){
          this.zone3 = videoCapturado;
          console.log(this.zone3, zona)
          this.getClips(this.zone3, zona) 
          this.i++
        }
      }
      else if (videoCapturado.type === 'video/mp4' && [4,5,6].includes(zona)) {
        this.filesI.push(videoCapturado)
        console.log('estamos en uploadfile izquierdo ', videoCapturado)  
        if (zona===4){
          this.zone4 = videoCapturado;
          console.log(this.zone4, zona)
          this.getClips(this.zone4, zona)
          this.i++
        }
        if (zona===5){
          this.zone5 = videoCapturado;
          console.log(this.zone5, zona)
          this.getClips(this.zone5, zona) 
          this.i++
        }
        if (zona===6){
          this.zone6 = videoCapturado;
          console.log(this.zone6, zona)
          this.getClips(this.zone6, zona) 
          this.i++
        }
      }
      else {
        this.openSnackBar(this.POPUP_VID_MP4, " X")
      }
  }

  getClips(files:any, zone:any) {
    var _this=this;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(files);
        reader.onloadend = function() {
          var base64data = reader.result;
          var file = {zone: zone, file: base64data} 
          _this.saveCaseImages(file)
        }
        });
  }  
  
  deleteAttachmentD(index:any) {
    this.filesD.splice(index, 1);
    this.i--
    console.log(this.frames)
  }

  deleteAttachmentI(index:any) {
    this.filesI.splice(index, 1);
    this.i--
    console.log(this.frames)
  }

  saveCaseImages(zone:any){
    this.uploadService.saveCaseImages(zone).subscribe(
      (res) => {
      console.log('result del saveCaseImages en el componente' , res); 
      this.framesBuenas.push(res); 
    });
  }

  goNext(){ //TODO
    console.log(this.i)
    if(this.i < 6) {
      this._snackBar.open(this.POPUP_VID_ZONES, " X")
    } else {
      this.i=0;
      //this._snackBar.open(this.POPUP_UPLOAD, " ✓")
      Swal.fire({
        icon: 'success',
        title: 'Caso subido con éxito',
        showConfirmButton: false,
        timer: 1000
      })
      this.router.navigate(['/teacher'])/* , {queryParams: {frames: JSON.stringify(this.framesBuenas), case: JSON.stringify(this.case)}}) */;
    } 
    
  }
  
}



/*   nextImg(){
    this.record();
    this.saveCaseImages(this.actualFrame);
    this.changeFrame();
  }
   changeFrame(){
    this.actualFrame += 1;
    console.log(this.actualFrame)
  }

  record(){
    this.uploadService.record().subscribe((result) => {
      console.log('result del record_coord en el componente' , result);  
    }); 
  } */

  