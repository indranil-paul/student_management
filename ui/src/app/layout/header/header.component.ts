import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AppAlertService } from 'src/app/core/app-alert.service';
import { StudentService } from 'src/app/core/student.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  isLoggedIn: any;
  displayWelcomeMsg: string = "";
  subjectSubs!: Subscription;
  hasProfile: string = "";

  constructor(private authService: AuthService, private alert: AppAlertService, private studentService: StudentService) {
    this.subjectSubs = this.studentService.onMessage().subscribe(msg => {
      if (msg) {
        let user = msg.text;
        let uname = user?.split("|")[1];
        let fname = user?.split("|")[2];
        let lname = user?.split("|")[3];
        let hasprofile = user?.split("|")[6];

        this.displayWelcomeMsg = "Welcome " + fname + " " + lname + "(" + uname + ")";
        if (hasprofile == 'true'){
          this.hasProfile = "disabled";
        } else {
          this.hasProfile = "";
        }
      }
    });
  }

  ngOnInit(): void {
    this.displayWelcomeMsg = "";
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.IsLoggedIn.subscribe({ next: (res:any) => { this.isLoggedIn = res;}});   

    
  }

  ngOnDestroy() {
    this.subjectSubs.unsubscribe();
  }
  
  onLogout(): void {
    this.displayWelcomeMsg = "";
    this.alert.warning("You are logged out! Redirecting to login page ...");
    setTimeout(() => {      
      this.authService.logout();
    }, 4000);
  }

}
