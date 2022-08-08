import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/services/user/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  selectedUser: any;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) 
  {
    this.route.queryParams.subscribe( () => {
      if (this.router.getCurrentNavigation()?.extras.state){
        this.selectedUser = this.router.getCurrentNavigation()?.extras.state?.['selectedUser'];
        console.log("USER EN TEACHER: ",this.selectedUser)
      }
    }) 
   }

  ngOnInit(): void {

  }


}
