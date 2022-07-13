import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { APIEndPoints as ep} from 'src/app/core/app.config';
import { map, tap  } from 'rxjs/operators';


@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private token: string = "";
  private refreshToken: string = "";
  private tokenDecoded: any;
  private refreshTokenTimeout: any;

  get IsLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router, public http: HttpClient) {}

  /**
   * 
   * @returns 
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

  /**
   * 
   */
  private decodeToken(): void {
    let token_parts = this.token.split(/\./);
    
    this.tokenDecoded = JSON.parse(window.atob(token_parts[1]));
    console.log(this.tokenDecoded);
    this.startRefreshTokenTimer();
  
    let isTokenExpired = (Math.floor((new Date).getTime() / 1000)) >= this.tokenDecoded.exp ? "Y" : "N";
    localStorage.setItem('token_expired', isTokenExpired);
  }

  /**
   * Sets the access & refresh token in localstorage
   * @param _authRes The token response
   */
  private setSession(_authRes: any): void {
    this.token = _authRes.access;
    if (_authRes.refresh){
      this.refreshToken = _authRes.refresh;
    }
    localStorage.setItem('access_token', this.token);
    localStorage.setItem('refresh_token', this.refreshToken);
    this.decodeToken();
  }

  /**
   * Fetches the JWT tokens by calling the api
   * @param _reqBody The Request body 
   */
  private fetchToken(_reqBody: any) {
    this.http.post(ep.api_gettoken, _reqBody)
    .subscribe((res: any) => {
      if (res) {        
        this.setSession(res);
        this.loggedIn.next(true);      
        this.router.navigate(['/home']);
      }
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

      setTimeout(() => {
        this.getUserInfo();
      }, 2000);
      
    }
  }

  /**
   * Logout user
   */
  public logout(): void {
    this.stopRefreshTokenTimer();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expired');
    localStorage.removeItem('user_details');
    this.token = "";
    this.refreshToken = "";
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Fetches logged in user details
   */
   private getUserInfo() {
    this.http.get(ep.api_user)
    .subscribe((res: any) => {
      if (res.status == 'success') {
        let userDetails = res.data.uname + "|" + res.data.fname + "|" + res.data.lname + "|" + res.data.email;
        localStorage.setItem("user_details", userDetails);
      }
    });
  }

  /**
   * 
   */
  private refreshAccessToken(): Observable<any> {
    return this.http.post(ep.api_refreshtoken, {"refresh": this.refreshToken}, { withCredentials: true })
      .pipe(map((res) => {
        this.setSession(res);
        return res;
      }));
  }

  /**
   * 
   */
  startRefreshTokenTimer(): void {
    let jwtexp = new Date(this.tokenDecoded.exp * 1000);
    let jwtexpTimeout = jwtexp.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshAccessToken().subscribe(), jwtexpTimeout);
  }


  /**
   * 
   */
  stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }
  
}