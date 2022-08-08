import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

 constructor(private authService:AuthService, public router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //console.log(localStorage.getItem('user'))
    if (!this.authService.isNotLoggedIn) {
    if(this.authService.teacherLoggedIn){
      this.router.navigate(['/teacher'])
      return false;}
      else{
      this.router.navigate(['/student'])
      return false;
    }} else {
      return true;
    }
  }}

