import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { User } from '../services/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  username: any;
  selectedUser: User = {
    name: '',
    surnames: '',
    username: '',
    email:'',
    password: '',
    reppassword:'',
    role: '',
    assignedTeacher: ''
  };

  headers = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded');

  readonly URL_API_USERS = 'http://localhost:3000/users';
  readonly URL_API_STUDENTS = this.URL_API_USERS+'/students';
  readonly URL_API_STUDENTS_ASSIGNED = this.URL_API_STUDENTS+'/assigned';
  readonly URL_API_TEACHERS = this.URL_API_USERS+'/teachers';
  readonly URL_API_DELETE = this.URL_API_USERS+'/delete'
  readonly URL_API_ROLE = this.URL_API_USERS + '/role';
  readonly URL_API_REGISTER = 'http://localhost:3000/auth/register'
  readonly URL_API_LOG = 'http://localhost:3000/auth/login';
  readonly URL_API_PROFILE = this.URL_API_STUDENTS+'/profile'
  readonly UR_API_ASSIGN_CASE = this.URL_API_USERS+'/assign/case'
  readonly UR_API_UNASSIGN_CASE = this.URL_API_USERS+'/unassign/case'


  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(this.URL_API_USERS);
  }

  getStudents() {
    return this.http.get(this.URL_API_STUDENTS);
  }

  getAssignedStudents(_id:any) {
    return this.http.get(this.URL_API_STUDENTS_ASSIGNED, {params: {idTeacher:_id}})
  }

  getTeachers() {
    return this.http.get(this.URL_API_TEACHERS);
  }

/*   noAuthHeader = new HttpHeaders()
  .set('NoAuth','True' ); */

  postUser(user: User) {
    return this.http.post(this.URL_API_REGISTER, user);
  } 

 login(user: User) {
    this.username = user.username
    return this.http.post(this.URL_API_LOG, user);
  } 

  getUserRole() {
    return this.http.get(this.URL_API_ROLE)
  } 

  showProfile() {
    return this.http.get(this.URL_API_PROFILE)
  }

  deleteUser(user:any) {
    console.log(this.URL_API_DELETE+'/'+user._id);
    return this.http.delete(this.URL_API_DELETE+'/'+user._id);
  }

  assignCase(caso:any, user:any) {
    console.log(caso,user)
    return this.http.post(this.UR_API_ASSIGN_CASE, {caso, user})
  }

  unassignCase(caso:any, user:any) {
    console.log(caso,user)
    return this.http.post(this.UR_API_UNASSIGN_CASE, {caso, user})
  }

}
