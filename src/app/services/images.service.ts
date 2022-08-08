import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from './user/user';
import { Image } from './image/image';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  readonly URL_API = 'http://localhost:3000';
  readonly URL_API_CASE = this.URL_API+'/us'
  readonly URL_API_CASES = this.URL_API+'/storage'
  readonly URL_API_DELETE_CASE = this.URL_API_CASES+'/delete'
  readonly URL_API_ASSIGNED = this.URL_API_CASES+'/assigned'
  readonly URL_API_TRAINING = this.URL_API+'/us/training'
  readonly URL_API_TYPE = this.URL_API_CASE+'/type'
  readonly URL_API_TITLE = this.URL_API_CASES+'/title'
  readonly URL_API_CASEID = this.URL_API_CASES+'/title/id'

  user!:User;
  listUsers: any;
  userRole: any;
  selectedCase: any;

  headers = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded');

  constructor(private http:HttpClient, private userService:UserService) { }

  showCases() {
    return this.http.get(this.URL_API_CASES)
  }

  showAssignedCases(username:any) {
    return this.http.get(this.URL_API_ASSIGNED, {params: {username: username}})
  }

  deleteCase(casoId: any) {
    console.log(this.URL_API_DELETE_CASE+'/'+casoId)
    return this.http.delete(this.URL_API_DELETE_CASE+'/'+casoId)
  }

  showImage() {
    return this.http.get(this.URL_API_TRAINING)
  }

  getCase(caso:any) {
    console.log(caso._id)
    //JSON.parse(caso._id)
    return this.http.get(this.URL_API_CASE, {params: {casoId: caso._id}}) //falta q solo muestre el que es
  }

  getCase2(title:any) {
    return this.http.get(this.URL_API_CASEID, {params: {casoT: title}})
  }

  setCase(caso: string, username: string) {
    return this.http.post(this.URL_API_CASE, {body: caso})
    /* var cuerpo = new HttpParams().set('case', caso);
    cuerpo = cuerpo.set('user', username);
    this.selectedCase = caso;

    this.http.post(this.URL_API_CASE, cuerpo, { headers: this.headers})
      .subscribe(
        (res) => {
            console.log(res);
        },
        err => console.log(err)
    ); */
  } 

  arduinoMode(type:any) {
    JSON.stringify(type)
    console.log('tipo'+ type)
    return this.http.post(this.URL_API_TYPE, {type:type})
  }

  getTitle(caso_id:any) {
    return this.http.get(this.URL_API_TITLE, {params: {caso_id}})
  }

}
