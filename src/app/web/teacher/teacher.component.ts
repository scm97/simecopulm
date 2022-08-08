import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagesService } from 'src/app/services/images.service';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/services/user/user';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ], 
})


export class TeacherComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user') || '{}');

  students:any = [];
  listUsers: any;

  dataSource:any;
  displayedColumns: string[] = ['name', 'surnames', 'username', 'assign', 'profile', 'delete'];

  readonly URL_API = "http://localhost:3000/users";

  constructor(
    private imagesService: ImagesService, 
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute, 
    private HttpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
    ) {
      this.route.queryParams.subscribe( () => {
        if (this.router.getCurrentNavigation()?.extras.state){
          this.user = this.router.getCurrentNavigation()?.extras.state?.['user'];
          console.log("USER EN TEACHER: ",this.user)
        }
      })      
     }

  ngOnInit() {
    this.getAssignedStudents();
    }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 3000,
      });
    }

/*   getStudents () {
    this.userService.getStudents().subscribe((res:any) => {
      console.log(res);
      this.students = res.student;
      this.dataSource = new MatTableDataSource(this.students);
    })
  } */

  getAssignedStudents () {
    this.userService.getAssignedStudents(this.user._id).subscribe((res:any) => {
      console.log(res);
      this.students = res;
      this.dataSource = new MatTableDataSource(this.students);
    })
  }

  deleteUser (selectedUser:any) {
    console.log(selectedUser)
    this.userService.deleteUser(selectedUser).subscribe((res:any) => {
      console.log(res)
      this.openSnackBar('Usuario '+selectedUser+' eliminado con éxito', "OK")
    });
    window.location.reload();
  }

  showEvaluations(selectedUser:any) {
    this.router.navigate(['/evaluation-list'], {state : {selectedUser}});
    console.log('he entrado en la evaluation')
  }

  assignCases (selectedUser:any) {
    this.router.navigate(['/assign-cases'], {state : {selectedUser}});
    console.log('he entrado en la assign')
  }

  openDialog(selectedUser:any) {
    const dialogRef = this.dialog.open(DialogStudent);
    localStorage.setItem('deletedUser',JSON.stringify(selectedUser))
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
}


@Component({
  selector: 'app-student',
  templateUrl: './dialog.html',
  styleUrls: ['./teacher.component.css'],
})

export class DialogStudent {
  dialogRef: any;
  deletedUser = JSON.parse(localStorage.getItem('deletedUser') || '{}');

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public imageService: ImagesService,
    public userService: UserService
  ) {

  }

  ngOnInit() {
  this.deletedUser = JSON.parse(localStorage.getItem('deletedUser') || '{}');
  console.log(this.deletedUser);
  }

  cancel() {
    this.dialog.closeAll()
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  deleteUser () {
    console.log(this.deleteUser)
    this.userService.deleteUser(this.deletedUser).subscribe((res:any) => {
      console.log(res)
      Swal.fire({
        icon: 'success',
        title: 'Usuario '+this.deletedUser.username+' eliminado con éxito',
        showConfirmButton: false,
        timer: 1000
      })
      //this.openSnackBar('Usuario '+this.deletedUser.username+' eliminado con éxito', "OK")
    });
    this.dialog.closeAll()
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  }

}
