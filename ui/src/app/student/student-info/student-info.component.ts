import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AppAlertService } from 'src/app/core/app-alert.service';
import { StudentService } from 'src/app/core/student.service';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent implements OnInit {

  public edited: boolean = false;
  public studentProfile!: Student;
  public updateForm: FormGroup = new FormGroup({});
  private userid: any;

  constructor(private router: Router, 
              private formBuilder: FormBuilder, 
              private studentService: StudentService, 
              private auth : AuthService,
              private alert: AppAlertService) { }

  /**
   * Initialize Formgroup and calls API to load the student info
   */
  ngOnInit(): void {
    const emailPat = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

    this.updateForm = this.formBuilder.group({
      fname: ['', [Validators.required, Validators.minLength(3)]],
      lname: ['', [Validators.required, Validators.minLength(3)]],
      dob: ['', [Validators.required]],
      gender: [{value: '', disabled: !this.edited}, []],
      degree: [{value: '', disabled: !this.edited}, [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      state: [{value: '', disabled: !this.edited}, [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern("^[0-9]{6}$")]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      emailid: ['', [Validators.required, Validators.pattern(emailPat)]],
    }); 
    this.updateForm.reset();

    /* Call API to load the Student profile */
    let user = localStorage.getItem('user_details');
    this.userid = user?.split("|")[0];
    this.studentService.get("api_student", this.userid).subscribe({
      next: (res: any) => {        
        this.studentProfile = res.data;

        this.updateForm.setValue({
          fname: this.studentProfile.fname,
          lname: this.studentProfile.lname,
          dob: this.studentProfile.dob,
          gender: this.studentProfile.gender,
          degree: this.studentProfile.degree,
          city: this.studentProfile.city,
          state: this.studentProfile.state,
          pincode: this.studentProfile.pincode,
          phone: this.studentProfile.phone,
          emailid: this.studentProfile.emailid,
        })
      },
      error: (err: any) => { 
        console.error(err);
        this.alert.error("Failed to load Student's profile!");
      }
    });
  }

  /**
   * Redirect to home page
   */
  public backToHome(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Toggle boolean variable to enable / disable the contorls
   */
  public editProfile(): void {
    this.edited = !this.edited;
    this.disableFormControls();
  }

  /**
   * Enable or disable the select & radio control
   */
  private disableFormControls(): void {
    this.updateForm.controls['degree'].disabled ? this.updateForm.controls['degree'].enable() : this.updateForm.controls['degree'].disable();
    this.updateForm.controls['state'].disabled ? this.updateForm.controls['state'].enable() : this.updateForm.controls['state'].disable();
    this.updateForm.controls['gender'].disabled ? this.updateForm.controls['gender'].enable() : this.updateForm.controls['gender'].disable();
  }

  /**
   * Calls API to save the changes
   * @param student student instance
   */
  public saveChanges(student: Student) {
    this.edited = false;
    this.studentService.put("api_student", student, this.userid).subscribe({
      next: (res: any) => {
        console.log(res);
        this.alert.success("Successfully updated Student's profile");
        this.onReset();
      },
      error: (err: any) => {
        console.error(err);
        this.alert.error("Failed to load Student profile!");
      }
    });
  }

  /**
   * On reset disables the controls
   */
  public onReset(): void {
    this.edited = false;
    this.disableFormControls();
  }

}
