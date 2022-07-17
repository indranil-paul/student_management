import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from 'src/app/models/student';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { StudentService } from 'src/app/core/student.service';
import { AppAlertService } from 'src/app/core/app-alert.service';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-student-reg',
  templateUrl: './student-reg.component.html',
  styleUrls: ['./student-reg.component.css']
})
export class StudentRegComponent implements OnInit {

  public registrationForm: FormGroup = new FormGroup({});

  constructor(private router: Router, 
              private formBuilder: FormBuilder, 
              private studentService: StudentService, 
              private auth : AuthService,
              private alert: AppAlertService) { }

  /**
   * Initialzes the form validator
   */
  ngOnInit(): void {
    const emailPat = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

    this.registrationForm = this.formBuilder.group({
      fname: ['', [Validators.required, Validators.minLength(3)]],
      lname: ['', [Validators.required, Validators.minLength(3)]],
      dob: ['', [Validators.required]],
      gender: ['', []],
      degree: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern("^[0-9]{6}$")]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      emailid: ['', [Validators.required, Validators.pattern(emailPat)]],
    }); 
    this.registrationForm.reset();
  }
  
  /**
   * Calls api to POST new record
   * @param student The student form object
   */
  onSave(student: Student): void{
    let user  = this.auth.userInfo();
    if (user)
      student.user = user.id;
    else {
      let user = localStorage.getItem('user_details');
      let id: any = user?.split("|")[0];
      student.user = parseInt(id);
    }

    this.studentService.post("api_student", student).subscribe({
        next: (val: any) => {console.log(val); this.alert.success("Successfully Saved!"); this.registrationForm.reset();},
        error: (err: any) => {
          console.error(err);          
          if (err.error.data || err.error.msg)
            this.alert.error(err.error.data + " " + err.error.msg);
          else
            this.alert.error(err.statusText);
        },
    });
  }

  /**
   * Redirects to home
   */
  backToHome() {
    this.router.navigate(['/home']);
  }

}
