import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay } from 'rxjs';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  mainUser:any = JSON.parse(localStorage.getItem('user') || '{}');
  selectedCase = JSON.parse(localStorage.getItem('selectedCase') || '{}');
  eval:any;
  matching:any = [];
  absent1: any;
  absent2: any;
  absent:any =[];
  mark:any;
  return:boolean = false;

  eval_list:any;
  list: boolean = false;
  diagC:any;
  diagI:any;

  readonly POPUP_RETURN = "Por favor, introduzca una imagen";
  nota: any;
  user: any;

  constructor(public evalService: EvaluationService,
    public imageService: ImagesService, 
    private router: Router,
    private route: ActivatedRoute, 
    private HttpClient: HttpClient,
    private _snackBar: MatSnackBar ) {
    this.route.queryParams.subscribe( () => {
      if (this.router.getCurrentNavigation()?.extras.state){
        this.eval = this.router.getCurrentNavigation()?.extras.state?.['eval'];
        this.mark = this.router.getCurrentNavigation()?.extras.state?.['nota'];
        this.eval_list = this.router.getCurrentNavigation()?.extras.state?.['eval_list'];
        this.user = this.router.getCurrentNavigation()?.extras.state?.['selectedUser']
        console.log("EVAL EN EVALUACION: ",this.eval)
        console.log("NOTA EN EVALUACION: ",this.mark)
        console.log("EVAL_LIST EN EVALUACION: ",this.eval_list)
      }
    })
   }

  ngOnInit() {
    this.diagC = this.eval.diagnosticC
    console.log(this.diagC)
    this.diagI = this.eval.diagnosticI
    console.log(this.diagI)
/*     if (this.eval) {

    }
    if(!this.eval) {
      this.comparePatterns();
      this.compareDiagnostic();
    }
    if(this.eval_list) {
      this.list=true;
    } */
  }

  saveMark () {
    this.return = true;
    this.evalService.saveMark(this.eval._id, this.mark).subscribe()
    console.log(this.eval)
    if (this.mainUser.role === 1) {
      //this.imageService.arduinoMode('off').subscribe()
      this.router.navigate(['/evaluation-list'], {state: {'selectedUser': this.mainUser}});
    } 
    else {
      this.router.navigate(['/evaluation-list'], {state: {'selectedUser': this.user}})
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  goBack () {
    this.router.navigate(['/evaluation-list'])
  }
  


}
