import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public userService: UserService) { }
  
  get isLoggedIn():boolean{
  const user = JSON.parse(localStorage.getItem('user') as string)
  //console.log(user)
  return user !==null ? true: false
  }
  
  get isNotLoggedIn():boolean{
  const user = JSON.parse(localStorage.getItem('user') as string)
  //console.log(user)
  return user ===null ? true: false
  }
  
 
  get teacherLoggedIn():boolean{
  const role = JSON.parse(localStorage.getItem('role') as string)
  //console.log(role)
  return role !==0 ? false: true
  }
  
  get studentLoggedIn():boolean{
  const role = JSON.parse(localStorage.getItem('role') as string)
  //console.log(role)
  return role !==1 ? false: true
  }
  
}
