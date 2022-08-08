import { state } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'], 
})
export class TrainingComponent implements OnInit {
  title = 'frontend';
  impath: any;
  show = false;
  caseSelected: any;
  dopplerStat = true;
  vidpath: any;
  x = true;
  color = 'primary';

  yaw: any;
  pitch: any;
  roll: any;

  caso:any;
  user= JSON.parse(localStorage.getItem('user') || '{}');
  interv:any;

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

  patternsSelected=[];

  cambiaVideobool = false;

  ready:boolean = false;

  diagnostic:any
  evaluacion: any;
  saved: boolean = false;
  derrame: boolean = false;
  neumo: boolean = false;
  matching: any;
  absent1: any;
  absent2: any;
  mark: number = 0;
  absent: any;
  diagC: any;
  diagI: any;
  sent: boolean = false;


  constructor( private imageService: ImagesService, 
    private evaluationService: EvaluationService, 
    private ref: ChangeDetectorRef, 
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder)
    {
      this.form = this.fb.group({
        checkArray: this.fb.array([])
      })
    
      this.route.queryParams.subscribe( () => {
        if (this.router.getCurrentNavigation()?.extras.state){
          this.caseSelected = this.router.getCurrentNavigation()?.extras.state?.['selectedCase'];
          //console.log("CASO EN TRAINING: ",this.caseSelected)
        }
      })
     }



  ngOnInit() {
    this.showImage();
    this.getCase();
    //this.doppler();
  }


  showImage() {
    this.interv = setInterval(() => {
      this.imageService.showImage()
      .subscribe(res => {
        this.impath = res;
        this.ref.markForCheck();
        //console.log('the path is: ' + this.impath );
      });
    }, 500);
  }
  

  getCase() {
    this.imageService.getCase(this.caseSelected)
      .subscribe((res:any) => {
        console.log('Titulo caso: ' + res.title);
      })
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

  comparePatterns() {
    let strArr1 = this.form.value.checkArray;
    let strArr2 = this.caseSelected.patterns;
    console.log(strArr1)
    console.log(strArr2)
    this.matching = strArr1.filter((value:any) => strArr2.includes(value));
    console.log(this.matching)
    this.absent1 = strArr1.filter((value:any) => !strArr2.includes(value))
    this.absent2 = strArr2.filter((value:any) => !strArr1.includes(value))
    this.absent = this.absent1, this.absent2
    console.log(this.absent)
    this.mark = ((this.matching.length-(this.absent1.length+this.absent2.length)*0.25)/this.caseSelected.patterns.length)*10;
    if (this.mark < 0) {
      this.mark = 0;
    }
    if (this.mark > 10) {
      this.mark = 10;
    }
    console.log(this.mark)
  }

  compareDiagnostic(diagnostic:any) {
    console.log(diagnostic)
    console.log(this.caseSelected.diagnostic)
    if(diagnostic === this.caseSelected.diagnostic) {
      this.diagC = diagnostic;
      this.mark = this.mark + 2;
      console.log(this.mark)
    } else {
      this.diagI = this.caseSelected.diagnostic;
      this.mark = this.mark - 2;
      console.log(this.mark)
    }
    if (this.mark < 0) {
      this.mark = 0;
    }
    if (this.mark > 10) {
      this.mark = 10;
    }
    console.log(this.mark)
    
  }

  saveEval() {
    this.comparePatterns()
    console.log('CASO '+this.caseSelected)
    console.log('PATRONES '+this.form.value.checkArray)
    console.log('USUARIO '+this.user)
    console.log('NOTA :'+this.mark)
    this.sent = true;
    if (this.form.value.checkArray.includes('Derrame torácico')) {
      console.log('derrame')
      this.derrame = true;
      this.neumo = false;
    }
    if (this.form.value.checkArray.includes('Neumotórax')) {
      console.log('neumo')
      this.neumo = true;
      this.derrame = false;
    }
    /* if (this.form.value.checkArray.includes('Derrame torácico') && this.form.value.checkArray.includes('Colapso alveolar')) {
      this.neumo = true;
      this.derrame = true;
    } */
    if (this.neumo === false && this.derrame === false){
      this.saved = true;
    }
    this.evaluationService.saveEval(this.caseSelected._id,this.matching, this.absent,this.user._id, this.mark).subscribe((res:any) => {
      this.evaluacion = res;
      console.log(this.evaluacion)
    })
    console.log(this.neumo)
    console.log(this.derrame)
    console.log(this.saved)
  }


  treatmentD(form:NgForm) {
  this.compareDiagnostic(form.value.diagnostic)
  this.evaluationService.saveDiagnostic(this.evaluacion._id, this.diagC, this.diagI).subscribe()
  this.evaluationService.saveMark(this.evaluacion._id, this.mark).subscribe()
  this.evaluationService.getEval(this.evaluacion._id).subscribe((res:any) => {
    console.log(res)
    this.evaluacion = res[0];
    console.log(this.evaluacion)
  })
  setTimeout(() => {
  this.imageService.arduinoMode('derrame').subscribe()
  localStorage.setItem('selectedCase',JSON.stringify(this.caseSelected))
  this.router.navigate(['/treatment'], {state : {'caso': 1, 'nota': this.mark, 'diagC': this.diagC, 'diagI': this.diagI}});
  localStorage.setItem('evaluacion', JSON.stringify(this.evaluacion));
  console.log('he entrado en el tratamiento del caso '+this.caseSelected)
  clearInterval(this.interv);
  },
  1000);
  }

  treatmentN (form:NgForm) {
  console.log(this.evaluacion)
  this.compareDiagnostic(form.value.diagnostic)
  this.evaluationService.saveDiagnostic(this.evaluacion._id, this.diagC, this.diagI).subscribe()
  this.evaluationService.saveMark(this.evaluacion._id, this.mark).subscribe()
  this.evaluationService.getEval(this.evaluacion._id).subscribe((res:any) => {
    console.log(res)
    this.evaluacion = res[0];
    console.log(this.evaluacion)
  })
  setTimeout(() => {
  this.imageService.arduinoMode('neumo').subscribe()
  localStorage.setItem('selectedCase',JSON.stringify(this.caseSelected))
  this.router.navigate(['/treatment'], {state : {'caso': 0, 'nota': this.mark, 'diagC': this.diagC, 'diagI': this.diagI}});
  localStorage.setItem('evaluacion', JSON.stringify(this.evaluacion));
  console.log('he entrado en el tratamiento del caso '+this.caseSelected)
  clearInterval(this.interv);
  }
  ,1000);
  }


  finishEval(form:NgForm) {
    console.log(form.value);
    this.compareDiagnostic(form.value.diagnostic)
    this.evaluationService.saveDiagnostic(this.evaluacion._id, this.diagC, this.diagI).subscribe()
    this.evaluationService.saveMark(this.evaluacion._id, this.mark).subscribe()
    this.evaluationService.getEval(this.evaluacion._id).subscribe((res:any) => {
      console.log(res)
      this.evaluacion = res[0];
      console.log(this.evaluacion)
    })
    setTimeout(() => {
      localStorage.setItem('selectedCase',JSON.stringify(this.caseSelected))
    this.imageService.arduinoMode('off').subscribe()
    this.router.navigate(['/evaluation'], {state: {'eval': this.evaluacion, 'nota': this.mark, 'diagC': this.diagC, 'diagI': this.diagI }});
    clearInterval(this.interv);
    }
    , 1000);
    
  }


  selectEval() {
    console.log('estoy en selectEval del componente');
    //this.evaluationService.selectEval().subscribe();
  }

  goBack() {
    let mode = 'off'
    this.imageService.arduinoMode(mode).subscribe()
    this.router.navigate(['/student'])
  }
}


    // Para que se recarge la imagen cada segundo inportamos la clase ChangeDetectorRefe y ChangeDetectionStrategy (linea 2),
    // Configuramos ChangeDetectionStrategy en el modo OnPush (linea 15), para que se comprueben posibles cambios cuando se le indique.
    // Declaramos el objeto ref del tipo ChangeDetectorRef en el constructor (linea 24).
    // Cada segundo realizamos una comprobación de posibles cambios en la app con el método markforCheck (linea 36).

