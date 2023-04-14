import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AuthUser } from './common/auth-user';
import { PluginService } from './services/plugin.service';
import { PxPluginInfo } from './common/px-plugin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dario';

  constructor(private authSvc: AuthService,
    private router: Router,
    private pluginSvc: PluginService) {
    this.authUser = null;
  }

  authUser: AuthUser | null;
  plugins: PxPluginInfo[] = [];

  ngOnInit() {
    this.authSvc.authUser$.subscribe(r => this.authUser = r);
    this.router.navigate(['/logon']);
  }

  logout() {
    this.authSvc.logout();
    this.router.navigate(['/logon']);
  }

  refreshPlugins() {
    this.pluginSvc.getList().subscribe(r => {
      this.plugins = r;
    })
  }

  onPlugin(key: string) {
    this.router.navigate(['/plugin'], { queryParams: { plugin: key } });
  }
}
