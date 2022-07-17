import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

// Components
import { AppComponent } from './app.component';
import { StudentRegComponent } from './student/student-reg/student-reg.component';
import { StudentInfoComponent } from './student/student-info/student-info.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

// Services
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { StudentService } from './core/student.service';
import { AppInterceptor } from './core/app-interceptor';
import { CustomAlertComponent } from './custom-alert/custom-alert.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentRegComponent,
    StudentInfoComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    CustomAlertComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => { return localStorage.getItem("access_token"); },
      },
    })
  ],
  providers: [AuthService, AuthGuard, StudentService, { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
