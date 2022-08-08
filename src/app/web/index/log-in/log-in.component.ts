import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Router, UrlSegment } from '@angular/router';


import { UserService } from 'src/app/services/user.service';
import { ImagesService } from 'src/app/services/images.service';
import { User } from 'src/app/services/user/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(
    private userService: UserService, 
    private router: Router, 
    private imagesService: ImagesService,
    private _snackBar: MatSnackBar) { }

  hide: boolean = true;

  model = {
    username: '',
    password: ''
  };

  role: any;
  username: any;

  readonly POP_UP_VALID = 'Sesión iniciada correctamente'
  readonly POP_UP_INVALID = 'Credenciales incorrectos. Por favor, compruebe sus datos e inténtelo de nuevo'

  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  onSubmit(form:NgForm) {
    console.log(form.value);
    this.userService.login(form.value).subscribe( 
      (res:any) => {
        //Swal.fire('Sesión iniciada correctamente', '', 'success')
        this.openSnackBar(this.POP_UP_VALID, " ✓")
        console.log(res);
        console.log("ROL: "+res.user.role)
            if(res.user.role === 0) {
              localStorage.setItem('user',JSON.stringify(res.user));
              localStorage.setItem('role',JSON.stringify(res.user.role));
              this.router.navigate(['/teacher'],{state : {user : res.user}})
            } else if (res.user.role === 1) {
              localStorage.setItem('user',JSON.stringify(res.user));
              localStorage.setItem('role',JSON.stringify(res.user.role));
              this.router.navigate(['/student'], {state : {user : res.user}})
            }
          console.log("AQUI")
      },
      err => {
        console.log(err)
        /* Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectos',
          text: 'Por favor, compruebe sus datos e inténtelo de nuevo',
          showConfirmButton: true,
        }) */
       this.openSnackBar(this.POP_UP_INVALID, " X")
      }
    );

  } 
}
