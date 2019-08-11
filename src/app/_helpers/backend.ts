import {
    Injectable,
    Injector
} from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
    Observable,
    of,
    throwError
} from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { tap } from "rxjs/operators";
import { error } from 'util';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(
        private injector: Injector,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request);
    }

}

export let backendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true
};