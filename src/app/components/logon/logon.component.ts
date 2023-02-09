import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { InstrumService } from 'src/app/services/instrum.service';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.scss']
})
export class LogonComponent implements OnInit {
  login = '';
  password = '';
  error = '';

  constructor(private authSvc: AuthService, private router: Router, private instrumSvc: InstrumService) { }

  ngOnInit(): void {
  }

  logon() {
    this.error = '';
    if (this.login.trim().length === 0) {
      this.error = 'Не введен логин';
      return;
    }

    this.authSvc.logon(this.login, this.password).subscribe({
      next: (res) => {
        if (res) {
          this.instrumSvc.initialize();
          this.router.navigate(['/']);
        } else {
          this.error = 'Неверный логин или пароль';
        }        
      },
      error: (err) => {
        this.error = 'Неверный логин или пароль';
      }
    });
  }
}
