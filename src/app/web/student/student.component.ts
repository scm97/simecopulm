import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagesService } from 'src/app/services/images.service';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/services/user/user';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '200px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class StudentComponent implements OnInit {

  user!: User;
  cases:any=[];
  selectedCase:any
  dataSource:any;
  columnsToDisplay = ['title', 'resolve'];
  expandedCase : { title: string; subtitle: string; description: string; image: any } | null | undefined;



  constructor(
    public imageService: ImagesService, 
    private userService: UserService, 
    private evalService: EvaluationService,
    private router: Router,
    private route: ActivatedRoute, 
    private HttpClient: HttpClient,
    public dialog: MatDialog,
    ) {
      this.route.queryParams.subscribe( () => {
        if (this.router.getCurrentNavigation()?.extras.state){
          this.user = this.router.getCurrentNavigation()?.extras.state?.['user'];
          console.log("USER EN STUDENT: ",this.user)
        }
      })
     }

     
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    //this.imageService.arduinoMode('off').subscribe()
    this.imageService.showAssignedCases(this.user.username).subscribe((res:any) => {
    console.log(res)
    this.cases=res.assignedCases;
    this.dataSource = new MatTableDataSource(this.cases);
  })
}

startEval (selectedCase:any) {
  this.router.navigate(['/training'], {state : {selectedCase}});
  let mode = 'eco';
  this.imageService.arduinoMode(mode).subscribe()
  /* this.evalService.saveEval(this.selectedCase, this.user); */
  console.log('he entrado en la evaluacion del caso '+this.selectedCase+' y user '+this.user.username)
}

openDialog() {
  const dialogRef = this.dialog.open(DialogTraining);
  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  }

getEval(selectedCase:any) {
  console.log(selectedCase)
}

showEvals() {
  this.router.navigate(['/evaluation-list'], {state: {"selectedUser": this.user}})
}


}


@Component({
  selector: 'app-student',
  templateUrl: './dialog.html',
  styleUrls: ['./student.component.css'],
})

export class DialogTraining {
  dialogRef: any;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public imageService: ImagesService
  ) {}

  treatmentN() {
    this.imageService.arduinoMode('neumo').subscribe((res:any) => {
      console.log(res)
    })
    this.router.navigate(['/treatment'], {state : {'tipo': 'Neumotórax'}})
    this.dialog.closeAll();
  }

  treatmentD() {
    this.imageService.arduinoMode('derrame').subscribe((res:any) => {
      console.log(res)
    })
    this.router.navigate(['/treatment'], {state : {'tipo': 'Derrame torácico'}})
    this.dialog.closeAll();
  }

}

 