import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
 
  readonly URL_API = 'http://localhost:3000/us';
  readonly URL_API_TRAINING = this.URL_API+'/training';
  readonly URL_API_EVAL = this.URL_API+'/eval';
  readonly URL_API_SAVEEVAL = this.URL_API_EVAL+'/save';
  readonly URL_API_REGISTEREVAL = this.URL_API_EVAL+'/register';
  readonly URL_API_FINISHEVAL = this.URL_API_EVAL+'/finish';
  readonly URL_API_SHOWEVAL = this.URL_API_EVAL+'/show';
  readonly URL_API_LISTEVAL = this.URL_API_EVAL+'/list';
  readonly URL_API_MARKEVAL = this.URL_API_EVAL+'/mark'
  readonly URL_API_DIAGNOSTIC = this.URL_API_EVAL+'/diagnostic'

  constructor(private http: HttpClient, private userService: UserService) { }

  
  headers = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded');

  /* saveEval(caso:any, user:any) {
    var body = new HttpParams().set('case', caso);
    body = body.set('user', user);

    this.http.post(this.URL_API_SAVEEVAL, body, { headers: this.headers})
      .subscribe(
        (res) => {
            console.log(res);
        },
        err => console.log(err)
    );
  }  */

getEval(eval_id:any) {
  return this.http.get(this.URL_API_EVAL, {params: {eval_id}})
}

saveEval(caso:any, patternsC:any, patternsI:any, user:any, mark:any) {
  return this.http.post(this.URL_API_REGISTEREVAL, {caso, patternsC, patternsI, user, mark})    
}

saveDiagnostic (eval_id:any, diagnosticC:any, diagnosticI:any) {
  return this.http.post(this.URL_API_DIAGNOSTIC, {eval_id, diagnosticC, diagnosticI})
}


  finishEval(){
    console.log('estoy entrando en finishEval de imageservice')
    return this.http.get(this.URL_API_FINISHEVAL).subscribe(
      res => console.log(res), 
      error => console.log(error)
    );
  };
  
  saveMark(eval_id:any, mark:any) {
    return this.http.post(this.URL_API_MARKEVAL, {eval_id, mark})
  }

  showEval (case_id:any) {
    return this.http.get(this.URL_API_SHOWEVAL, {params: {case_id}})
  }

  getEvals(_id:any) {
    return this.http.get(this.URL_API_LISTEVAL, {params: {_id}})
  }



}
