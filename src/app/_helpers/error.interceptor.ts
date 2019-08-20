import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthenticationService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    private subscription: Subscription = new Subscription;

    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.subscription.add(this.authenticationService.logout().subscribe(() => {
                    location.reload(true);
                }));

            }
            // console.log(err);
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
