import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AppAlertService } from 'src/app/core/app-alert.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated: boolean = false;
  isLoggedIn: any;
  displayWelcomeMsg: string = "";

  constructor(private authService: AuthService, private alert: AppAlertService) {}

  ngOnInit(): void {
    this.displayWelcomeMsg = "";
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.IsLoggedIn.subscribe({ next: (res:any) => { this.isLoggedIn = res;}});

    if (this.isLoggedIn){
      let user = localStorage.getItem('user_details');
      let uname = user?.split("|")[1];
      let fname = user?.split("|")[2];
      let lname = user?.split("|")[3];
      this.displayWelcomeMsg = "Welcome " + fname + " " + lname + "(" + uname + ")";
    }
  }
  
  onLogout(): void {
    this.alert.warning("You are logged out! Redirecting to login page ...");
    setTimeout(() => {      
      this.authService.logout();
    }, 3000);
  }

}
