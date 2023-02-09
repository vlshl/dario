import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AuthUser } from '../common/auth-user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authUser$: Observable<AuthUser | null>;
  public authUser: AuthUser | null;
  private currentUser$: BehaviorSubject<AuthUser | null>;
  private authUrl = '';

  constructor(private http: HttpClient, private config: ConfigService) {
      this.currentUser$ = new BehaviorSubject<AuthUser | null>(null);
      this.authUser$ = this.currentUser$.asObservable();
      this.authUser = null;
      this.authUrl = this.config.getAuthUrl();
  }

  logon(login: string, password: string): Observable<boolean> {
    const params = (new HttpParams())
      .append('login', login)
      .append('password', password);

    return this.http.post<AuthUser>(this.authUrl, params.toString(), httpOptions)
      .pipe(
        map<AuthUser, boolean>(user => {
          const isSuccess: boolean = user != null && user.token != null;
          if (isSuccess) {
            this.currentUser$.next(user);
            this.authUser = user;
            this.authUser.password = password;
          }
          return isSuccess;
        }));
  }

  logout() {
      this.currentUser$.next(null);
      this.authUser = null;
  }
}
