import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StudentInfoComponent } from './student/student-info/student-info.component';
import { StudentRegComponent } from './student/student-reg/student-reg.component';
import { StudentUpdComponent } from './student/student-upd/student-upd.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent, pathMatch: 'full'},  
  { path: 'register', component:  StudentRegComponent, pathMatch: 'full'},
  { path: 'updinfo', component:  StudentUpdComponent, pathMatch: 'full'},
  { path: 'studinfo', component:  StudentInfoComponent, pathMatch: 'full'}, 
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '**',  redirectTo: "home", pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

