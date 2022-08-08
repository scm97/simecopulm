import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {

readonly POPUP = "Por favor, inicie sesión";
readonly POPUP_2 = "Acceso denegado";

  constructor(private authService:AuthService, private _snackBar: MatSnackBar, public router:Router){}
 
  openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 3000,
  });
}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //console.log(localStorage.getItem('user'))
    if (!this.authService.studentLoggedIn) {
    if(this.authService.teacherLoggedIn){
      this.openSnackBar(this.POPUP_2, "X")
      this.router.navigate(['/teacher'])
      return false;}
      else{
      this.openSnackBar(this.POPUP, "X")
      this.router.navigate(['/login'])
      return false;
    }} else {
      return true;
    }
  }}
