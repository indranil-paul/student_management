import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { StudentInfoComponent } from './student/student-info/student-info.component';
import { StudentRegComponent } from './student/student-reg/student-reg.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard]},  
  { path: 'register', component:  StudentRegComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'studinfo', component:  StudentInfoComponent, pathMatch: 'full', canActivate: [AuthGuard]}, 
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, pathMatch: 'full' },  
  { path: '**',  redirectTo: "home", pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
