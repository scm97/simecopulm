import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate{

readonly POPUP = "Por favor, inicie sesión";
readonly POPUP_2 = "Acceso denegado";

  constructor(private authService:AuthService, public router:Router,private _snackBar: MatSnackBar){}
  
  openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 3000,
  });
}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //console.log(localStorage.getItem('user'))
    if (!this.authService.teacherLoggedIn) {
    if(this.authService.studentLoggedIn){
      this.openSnackBar(this.POPUP_2, "X")
      this.router.navigate(['student'])
      return false;}
      else{
      this.openSnackBar(this.POPUP, "X")
      this.router.navigate(['login'])
      return false;
    }} else {
      return true;
    }
  }}
