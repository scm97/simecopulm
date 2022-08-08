import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.css']
})
export class TreatmentComponent implements OnInit {

  selectedCase= JSON.parse(localStorage.getItem('selectedCase') || '{}')
  caso:any;
  tipo:any;
  entrenamiento: boolean = false;
  evaluacion = JSON.parse(localStorage.getItem('evaluacion') || '{}');
  bien: string = '';
  mal: string = '';
  diagC: any;
  diagI: any;
  mark: any;

  constructor(
    private imageService: ImagesService, 
    private evalService: EvaluationService,
    private route: ActivatedRoute, 
    private router: Router,
    private _snackBar: MatSnackBar) 
  {
    this.route.queryParams.subscribe( () => {
      if (this.router.getCurrentNavigation()?.extras.state){
        this.caso = this.router.getCurrentNavigation()?.extras.state?.['caso'];
        this.tipo = this.router.getCurrentNavigation()?.extras.state?.['tipo'];
        this.diagC = this.router.getCurrentNavigation()?.extras.state?.['diagC'];
        this.diagI = this.router.getCurrentNavigation()?.extras.state?.['diagI'];
        this.mark = this.router.getCurrentNavigation()?.extras.state?.['nota'];
      }
    })      
   }

  ngOnInit() {
    console.log(this.selectedCase)
    console.log(this.caso)
    if (this.caso === 0 || this.caso === 1 || this.caso === 2) {
      console.log("CASO A TRATAR: ",this.caso)
      if (this.selectedCase.type === this.caso) {
        this.bien = 'Se está tratando el caso bien y el maniquí funcionará'
      } else {
        if (this.mark < 3) {
          this.mark = 0
        } else {
          this.mark = this.mark - 3
          console.log(this.mark)
          this.openSnackBar('Se ha decidido tratar una patología distinta a la que presenta el caso', ' X')
          this.evalService.saveMark(this.evaluacion._id, this.mark).subscribe()
          this.imageService.arduinoMode('off').subscribe()
          this.router.navigate(['/evaluation'], {state: {'eval': this.evaluacion, 'diagC': this.diagC,'diagI': this.diagI, 'nota': this.mark}})
        } 
      }
/*       this.caseType(); */
    }
    if (this.tipo) {
      this.entrenamiento = true;
      console.log("CASO A TRATAR: ",this.tipo)
      console.log('Se está entrenenando un caso de tipo '+this.tipo)
    }  
 /*    this.caseType(); */
  } 


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

/*   caseType() {
    if (this.caso) {
      console.log(this.selectedCase.type)
      this.imageService.arduinoMode(this.selectedCase.type).subscribe((res:any) => {
        console.log(res)
      })
    }
  } */

  finishTraining() {
    this.imageService.arduinoMode('off').subscribe()
    this.router.navigate(['/student']);
  }

  finishEval() {
    this.imageService.arduinoMode('off').subscribe()
    this.router.navigate(['/evaluation'], {state: {'eval': this.evaluacion, 'diagC': this.diagC,'diagI': this.diagI, 'nota': this.mark }});
  }

}
