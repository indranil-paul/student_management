import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated: boolean = false;
  isLoggedIn: any;
  displayWelcomeMsg: string = "";

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.displayWelcomeMsg = "";
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.IsLoggedIn.subscribe((status:any)=>this.isLoggedIn = status);

    setTimeout(() => {    
      if (this.isAuthenticated){
        let userDetails = localStorage.getItem('user_details');
        let uname = userDetails?.split("|")[0];
        let fname = userDetails?.split("|")[1];
        let lname = userDetails?.split("|")[2];
        this.displayWelcomeMsg = "Welcome " + fname + " " + lname + "(" + uname + ")" ;
      }
    }, 2000);
  }
  
  onLogout(): void {
    this.authService.logout();
  }

}
