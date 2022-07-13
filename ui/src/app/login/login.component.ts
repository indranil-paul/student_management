import { User } from '../models/user';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from 'src/app/core/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  formSubmitAttempt: boolean = false;
  failedtoLogin: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private studentService: StudentService, private router: Router) { }

  ngOnInit(): void {

    if (this.authService.isAuthenticated()) {
        this.router.navigate(['/home']);
    }

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get frmCtrl() { 
    return this.form.controls; 
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value);
    } else {
      this.formSubmitAttempt = true;
    }
  }

  isInvalid(field: string) {
    let ifValid = (!this.frmCtrl[field].valid && this.frmCtrl[field].touched) || (this.frmCtrl[field].untouched && this.formSubmitAttempt);
    return ifValid;
  }

}
