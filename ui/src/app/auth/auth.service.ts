import { BehaviorSubject, Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { APIEndPoints as ep} from 'src/app/core/app.config';
import { AppAlertService } from 'src/app/core/app-alert.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthService implements OnDestroy{
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private token: string = "";
  private refreshToken: string = "";
  private tokenDecoded: any;
  private refreshTokenTimeout: any;
  private jwtHelper = new JwtHelperService();
  private intervalId: any = 0;
  private loggedInUser: any;

  get IsLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router, public http: HttpClient, private alert: AppAlertService) {}

  /**
   * Checks whether user is authenticated or not
   * @returns Boolean - whether authenticated or not
   */
  public isAuthenticated(): boolean {
    let token: string | null = localStorage.getItem("access_token");
    let expired: string | null = localStorage.getItem("token_expired");
    
    if (token && expired == "N") {
      this.loggedIn.next(true);    
      return true;
    }
    else {
      this.loggedIn.next(false);    
      return false;
    }
  }

  public userInfo(): any {
    return this.loggedInUser;
  }

  /**
   * Decodes the JWT to find the expiring time
   */
  private decodeToken(): void {
    this.tokenDecoded = this.jwtHelper.decodeToken(this.token);
    this.startRefreshTokenTimer();
  }

  /**
   * Sets the access & refresh token in localstorage
   * @param _authRes The token response
   */
  private setSession(_authRes: any): void {
    if (_authRes.access){
      this.token = _authRes.access;
      localStorage.setItem('access_token', this.token);
    }    
    if (_authRes.refresh){
      this.refreshToken = _authRes.refresh;
      localStorage.setItem('refresh_token', this.refreshToken);
    }
    this.decodeToken();
  }

  /**
   * Fetches the JWT tokens by calling the api
   * @param _reqBody The Request body 
   */
  private fetchToken(_reqBody: any) {
    this.http.post(ep.api_gettoken, _reqBody)
      .subscribe({
        next: (res: any) => {
          this.setSession(res);
          this.loggedIn.next(true);      
          this.router.navigate(['/home']);
          this.alert.success("Login Successful!");
        },
        error: (err: any) => {
          this.alert.error("Login Failed!");
        },
        complete: ()=> { setTimeout(() => { this.getUserInfo(); }, 1000); }
      });
  }

  /**
   * Login user
   * @param user User object
   */
  public login(user: User): void {
    if (user.username !== '' && user.password !== '' ) {
      let reqBody = {
        'username': user.username.trim(),
        'password': user.password.trim()
      }
      this.fetchToken(reqBody);   
    }
  }

  /**
   * Logout user
   */
  public logout(): void {
    this.stopRefreshTokenTimer();
    localStorage.clear()
    this.token = "";
    this.refreshToken = "";
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Fetches logged in user details
   */
   private getUserInfo() {
    this.http.get(ep.api_user).subscribe({
      next: (res: any) => {
        if (res.status == 'success') {
          this.loggedInUser = res.data;
          let userDetails = res.data.id + "|" + res.data.uname + "|" + res.data.fname + "|" + res.data.lname + "|" + res.data.email + "|" + res.data.admin;
          localStorage.setItem("user_details", userDetails);
        }
      },
      error: (err: any) => { this.alert.error("Failed to fetch user details!"); }
    });
  }

  /**
   * Refreshes the token by call refresh API
   */
  private refreshAccessToken(): Observable<any> {
    return this.http.post(ep.api_refreshtoken, {"refresh": this.refreshToken})
      .pipe(map((res) => {
        this.setSession(res);
        return res;
      }));
  }

  /**
   * Set periodic call to validate the expiration of the token
   */
  startRefreshTokenTimer(): void {
    this.validateTokenExpiration(); 
    this.intervalId = setInterval(() => {
      this.validateTokenExpiration(); 
    }, 30000);

    let jwtexp = new Date(this.tokenDecoded.exp * 1000);
    let jwtexpTimeout = jwtexp.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshAccessToken().subscribe(), jwtexpTimeout);
  }

  /**
   * Checks whether the JWT expired or not
   */
  validateTokenExpiration(): void {
    let isTokenExpired = this.jwtHelper.isTokenExpired(this.token);
    localStorage.setItem('token_expired', isTokenExpired ? "Y" : "N");
  }

  /**
   * Stops the timer for refreshing token
   */
  stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }

  /**
   * clears the setinterval object
   */
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }  
}