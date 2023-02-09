import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private authUrl = '';

    constructor(private authenticationService: AuthService,
                private config: ConfigService) {
        this.authUrl = this.config.getAuthUrl();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url === this.authUrl) {
            return next.handle(req);
        } else {
            const currentUser = this.authenticationService.authUser;
            if (currentUser && currentUser.token) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }

            return next.handle(req).pipe(catchError(err => {
                if (err.status === 401) {
                    this.authenticationService.logout();
                    location.reload(); // полная перезагрузка всего приложения
                }
                return throwError(err);
            }));
        }
    }
}
