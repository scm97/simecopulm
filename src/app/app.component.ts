import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ImagesService } from './services/images.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  user = JSON.parse(localStorage.getItem('user') || '{}'); 
  title = 'Simulador US Pulmonar';
  actualRoute:any;
  role:any; 

  constructor(public userService: UserService, 
    private router: Router, 
    private imagesServices: ImagesService,
    private dialog: MatDialog,
    public authService: AuthService) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  profile() {
    this.router.navigate(['/profile'], {state: this.userService.username})
  }

   logOut() {
     //TODO borrar user
    localStorage.clear();
    this.router.navigate(['/login']).then(() => window.location.reload());
  }

  openDialogLogOut() {
    const dialogRefLogOut = this.dialog.open(DialogLogOut);
    dialogRefLogOut.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }  

  navigateHome() {
    console.log(this.user.role)
      if (this.user.role === 0) {
        this.router.navigate(['/teacher']);
      }
      if (this.user.role === 1) {
        this.router.navigate(['/student']);
      }
  }

}

@Component({
  selector: 'app-student',
  templateUrl: './dialogLogOut.html',
  styleUrls: ['./app.component.css'],
})

export class DialogLogOut {
  dialogRef: any;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public imageService: ImagesService,
    public userService: UserService
  ) {

  }

  logOut() {
    //TODO borrar user
   localStorage.clear();
   this.router.navigate(['/login']).then(() => window.location.reload());
   this.dialog.closeAll()
 }

  cancel() {
    this.dialog.closeAll()
  }


}
