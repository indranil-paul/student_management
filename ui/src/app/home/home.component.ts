import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentService } from '../core/student.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  hasProfile: boolean = false;
  subjectSubs!: Subscription;

  constructor(private router: Router, private studentService: StudentService) { }

  ngOnInit(): void {
    this.subjectSubs = this.studentService.onMessage().subscribe(msg => {
      if (msg) {
        let user = msg.text;
        let hasprofile = user?.split("|")[6];
        if (hasprofile == 'true'){
          this.hasProfile = true;
        } else {
          this.hasProfile = false;
        }
      }
    });
  }

  /**
   * Navigate to register page
   */
  public gotoRegPage(): void {
    this.router.navigateByUrl('register');
  }

  /**
   * Navigate to login page
   */
  public gotoProfilePage(): void {
    this.router.navigateByUrl('signup');
  }

}
