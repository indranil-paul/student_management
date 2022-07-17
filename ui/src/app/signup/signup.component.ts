import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppAlertService } from '../core/app-alert.service';
import { StudentService } from '../core/student.service';
import { User } from '../models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup = new FormGroup({});

  constructor(private router: Router, 
              private formBuilder: FormBuilder, 
              private studentService: StudentService, 
              private alert: AppAlertService) { }

  ngOnInit(): void {

    const emailPat = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.pattern(emailPat)]]
    }); 
    this.signupForm.reset();
  }

  public onSave(user: User): void{
    this.studentService.post("api_signup", user).subscribe({
      next: (val: any) => {
        console.log(val); 
        this.alert.success("Your account has been created successfully! Redirecting to login page ...");
        setTimeout(() => {      
          this.router.navigate(['/login']);
        }, 5000);
      },
      error: (err: any) => {
        console.error(err);
        this.alert.error("Failed to create account!")
      },
    });    
  }

  public backToLogin(): void {
    this.router.navigate(['/login']);
  }

}
