import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  readonly POPUP = "Por favor, inicie sesión";

  constructor(private authService: AuthService,private _snackBar: MatSnackBar, public router:Router){}
  
  openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 3000,
  });
}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //console.log(localStorage.getItem('user'))
    if (!this.authService.isLoggedIn) {
      this.openSnackBar(this.POPUP, "X")
      this.router.navigate(['login'])
      return false;
    } else {
      return true;
    }
  }}
