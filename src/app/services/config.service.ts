import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  getApiUrl(resName: string) {
    if (environment.production) {
      return 'api/' + resName;
    } else {
      return 'http://localhost:51000/api/' + resName;
    }
  }

  getAuthUrl() {
    if (environment.production) {
      return 'auth/user';
    } else {
      return 'http://localhost:51000/auth/user';
    }
  }
}
