import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/services/user/user';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [UserService]
})

export class SignUpComponent implements OnInit {
  
  selectedUser: any;
  serverErrorMessages: string | undefined;
  showSuccessMessage: boolean = false; 

  user!: User;
  teachers:any = [];

  readonly POP_UP_REGISTER = 'Usuario registrado con éxito'
  readonly POP_UP_EXISTING = 'Nombre de usuario ya existe. Por favor, introduzca otro distinto'
  

  constructor( private userService: UserService, private router:Router, private _snackBar: MatSnackBar) { 
     this.selectedUser = userService.selectedUser; 
  }

  ngOnInit(): void {
    this.getTeachers()
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.userService.postUser(form.value)
    .subscribe(res => {
      console.log(res);
      setTimeout(() => {
        this.showSuccessMessage = false; 
        this.router.navigateByUrl('/login');
      }, 0);
      this.openSnackBar(this.POP_UP_REGISTER, " ✓")
      this.resetForm(form);
    },
    err => {
      console.log(err);
      this.openSnackBar(this.POP_UP_EXISTING, " X")
    });
  }
  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      name: '',
      surnames: '',
      username: '',
      email:'',
      password: '',
      reppassword:'',
      role: '',
      assignedTeacher: ''
    };
    form.resetForm();
  }

  getTeachers () {
    this.userService.getTeachers().subscribe((res:any) => {
      this.teachers = res.teacher;
      console.log(this.teachers)
    })
  }

  validate(){if (this.userService.selectedUser.password===this.userService.selectedUser.reppassword     						&&this.userService.selectedUser.password.length>=4&&
  					  this.userService.selectedUser.email.length>0&&
  					  this.userService.selectedUser.surnames.length>0&&
  					  this.userService.selectedUser.role.length>0&&
  					  this.userService.selectedUser.name.length>0
  					  ){
  return false}else{
  return true}}
  
  validateP(){if (this.userService.selectedUser.password===this.userService.selectedUser.reppassword){
  return false}else{
  return true}}
  
  validateRole(){if (this.userService.selectedUser.role==='1'){
  return false}else{
  return true}}
  
  goBack() {
    this.router.navigate(['/login'])
  }
 
}
