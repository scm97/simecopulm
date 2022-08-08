import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  readonly URL_API = 'http://localhost:3000/storage';
  readonly URL_API_UPLOAD = this.URL_API+'/upload';
  readonly URL_API_UPLOAD_REC = this.URL_API_UPLOAD+'/record';
  readonly URL_API_UPLOAD_IMG = this.URL_API_UPLOAD+'/images';

  constructor(private http: HttpClient) { }

  createCase(params: any) {
    console.log("PARAMS: ", params);
    var _this = this;
    var reader = new FileReader();
    reader.onloadend = function() {
      console.log(reader.result);
      var base64data = reader.result;                           
      params.image = base64data;
      return _this.http.post(_this.URL_API_UPLOAD, params).subscribe();
    }
    reader.readAsDataURL(params.image); 
  }

  readFile (image: Blob) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();  
      reader.onloadend = () => {
        console.log(reader.result);                           
        resolve(reader.result);
        
      };
      reader.readAsDataURL(image);
    });
  }

  submitFile(params: {title: string, description: string, image: null, type: string;}){
    return this.http.post(this.URL_API_UPLOAD, params)
  }

  record(){
    return this.http.get(this.URL_API_UPLOAD_REC);
  }

  saveCaseImages(file: any){
     console.log("ESTAMOS EN: saveCaseImages: ", file)
    //console.log('PARAMETRO 1: ', frames.file)
    return this.http.post(this.URL_API_UPLOAD_IMG, {params: file});  

  
  }

}
