import { Component, OnInit } from '@angular/core';
import { ImagesService } from 'src/app/services/images.service';
import { Image } from 'src/app/services/image/image';
import { NgForm } from '@angular/forms';
import { DragDropDirective } from '../drag-drop.directive';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/services/user/user';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-assign-case',
  templateUrl: './assign-case.component.html',
  styleUrls: ['./assign-case.component.css']
})
export class AssignCaseComponent implements OnInit {

  cases:any=[];
  assignedCases: any=[];
  selectedUser: any;

  readonly POP_UP_ASSIGNED = 'Caso'

  constructor(private imageService: ImagesService, 
    private userService: UserService, 
    private router: Router, 
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog) 
  { 
    this.route.queryParams.subscribe( () => {
      if (this.router.getCurrentNavigation()?.extras.state){
        this.selectedUser = this.router.getCurrentNavigation()?.extras.state?.['selectedUser'];
        console.log("USER EN ASSIGN: ",this.selectedUser.username)
      }
    }) 
  }

  ngOnInit() {
    this.imageService.showCases().subscribe((res:any) => {
      console.log(res)      
      for (let caso of res.data) {
        console.log(caso)
          if (caso.type === 0) {
          caso.type='Neumotórax';
          } if (caso.type === 1) {
          caso.type='Derrame torácico';      
          } if (caso.type === 2) {
          caso.type='Otro';
        }
      }
      this.cases=res.data;
    })

     this.imageService.showAssignedCases(this.selectedUser.username).subscribe((res:any) => {
      console.log("SHOW CASES:"+res.assignedCases)
      console.log(res.assignedCases)
      
      for (let caso of res.assignedCases) {
        console.log(caso)
          if (caso.type === 0) {
          caso.type='Neumotórax';
          } if (caso.type === 1) {
          caso.type='Derrame torácico';      
          } if (caso.type === 2) {
          caso.type='Otro';
        }
      }
      this.assignedCases=res.assignedCases;
    console.log(this.assignedCases)
    })

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

 /*  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  } */

  editCase() {

  }

  deleteCase(caso:any) {
    this.imageService.deleteCase(caso._id).subscribe((res:any) => {
      this.openSnackBar(caso.title+' eliminado con éxito', " ✓")
    },
    err => {
      this.openSnackBar('Error al eliminar el caso', " X")
    })
    
  }

  assignCase(caso:any) {
    console.log('Component Assign Case ',caso)
    this.openSnackBar('Asignado '+caso.title+' con éxito', " ✓")
    this.userService.assignCase(caso._id, this.selectedUser.username).subscribe((res:any) => {
      console.log(res)
      this.imageService.showCases().subscribe((res:any) => {
        console.log(res)      
        for (let caso of res.data) {
          console.log(caso)
            if (caso.type === 0) {
            caso.type='Neumotórax';
            } if (caso.type === 1) {
            caso.type='Derrame torácico';      
            } if (caso.type === 2) {
            caso.type='Otro';
          }
        }
        this.cases=res.data;
      })
      this.imageService.showAssignedCases(this.selectedUser.username).subscribe((res:any) => {
        console.log("SHOW CASES:"+res.assignedCases)
        console.log(res.assignedCases)
        
        for (let caso of res.assignedCases) {
          console.log(caso)
            if (caso.type === 0) {
            caso.type='Neumotórax';
            } if (caso.type === 1) {
            caso.type='Derrame torácico';      
            } if (caso.type === 2) {
            caso.type='Otro';
          }
        }
        this.assignedCases=res.assignedCases;
      console.log(this.assignedCases)
      })
    })
   

  }

  unassignCase(caso:any) {
    console.log('Component Unassign Case ',caso)
    this.openSnackBar(caso.title+' retirado con éxito', " ✓")
    this.userService.unassignCase(caso._id, this.selectedUser.username).subscribe((res:any) => {
      console.log(res)
      this.imageService.showCases().subscribe((res:any) => {
        console.log(res)      
        for (let caso of res.data) {
          console.log(caso)
            if (caso.type === 0) {
            caso.type='Neumotórax';
            } if (caso.type === 1) {
            caso.type='Derrame torácico';      
            } if (caso.type === 2) {
            caso.type='Otro';
          }
        }
        this.cases=res.data;
      })
      this.imageService.showAssignedCases(this.selectedUser.username).subscribe((res:any) => {
        console.log("SHOW CASES:"+res.assignedCases)
        console.log(res.assignedCases)
        
        for (let caso of res.assignedCases) {
          console.log(caso)
            if (caso.type === 0) {
            caso.type='Neumotórax';
            } if (caso.type === 1) {
            caso.type='Derrame torácico';      
            } if (caso.type === 2) {
            caso.type='Otro';
          }
        }
        this.assignedCases=res.assignedCases;
      console.log(this.assignedCases)
      })
    },
    err =>
    this.openSnackBar('Error al retirar el caso '+caso.title, " X"))   
  }

  goBack () {
    this.router.navigate(['/teacher'])
  }

  openDialog(selectedCase:any) {
    const dialogRef = this.dialog.open(DialogDeleteCase);
    localStorage.setItem('deletedCase',JSON.stringify(selectedCase))
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'app-student',
  templateUrl: './dialog.html',
  styleUrls: ['./assign-case.component.css'],
})

export class DialogDeleteCase {
  dialogRef: any;
  deletedCase = JSON.parse(localStorage.getItem('deletedCase') || '{}');

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public imageService: ImagesService,
    public userService: UserService,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.deletedCase = JSON.parse(localStorage.getItem('deletedCase') || '{}');
    }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }


  deleteCase() {
    this.imageService.deleteCase(this.deletedCase._id).subscribe((res:any) => {
      Swal.fire({
        icon: 'success',
        title: this.deletedCase.title+' eliminado con éxito',
        showConfirmButton: false,
        timer: 1500
      })
      //this.openSnackBar(this.deletedCase.title+' eliminado con éxito', " ✓")
    },
    err => {
      this.openSnackBar('Error al eliminar el caso', " X")
    })
    this.dialog.closeAll()
  }

  cancel() {
    this.dialog.closeAll()
  }


}