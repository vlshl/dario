import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AuthUser } from './common/auth-user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dario';

  constructor(private authSvc: AuthService,
              private router: Router) {
                this.authUser = null;
  }

  authUser: AuthUser | null;

  ngOnInit() {
    this.authSvc.authUser$.subscribe(r => this.authUser = r);
    this.router.navigate(['/logon']);
  }

  logout() {
    this.authSvc.logout();
    this.router.navigate(['/logon']);
  }
}
