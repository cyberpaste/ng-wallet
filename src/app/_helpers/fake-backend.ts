import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Balance } from '../_models';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const users: User[] = [
            { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User' }
        ];

        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate - public
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                const user = users.find(x => x.username === request.body.username && x.password === request.body.password);
                if (!user) return error('Username or password is incorrect');
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: `fake-jwt-token`
                });
            }

            if (request.url.endsWith('/balance') && request.method === 'GET') {
                if (!isLoggedIn) return unauthorised();
                let data = localStorage.getItem('balance') || '[]';
                var balances = JSON.parse(data);
                return ok(JSON.parse(data));
            }

            if (request.url.endsWith('/users/logout') && request.method === 'GET') {
                return ok('ok');
            }

            if (request.url.endsWith('/balance/clear') && request.method === 'GET') {
                if (!isLoggedIn) return unauthorised();
                return ok(localStorage.setItem('balance', ''));
            }

            if (request.url.match(/\/balance\/\d+$/) && request.method === 'PUT') {
                if (!isLoggedIn) return unauthorised();
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);
                var balances = JSON.parse(localStorage.getItem('balance') || '[]');
                var total = getBalanceTotal(balances);
                balances.filter(
                    function (item) {
                        if (item.id === id) {
                            if (item.type == 'credit') {
                                total -= parseFloat(item.amount);
                            } else {
                                total += parseFloat(item.amount);
                            }
                            return false
                        }
                        return true;
                    });

                if (request.body.type == 'credit') {
                    total += parseFloat(request.body.amount);
                } else {
                    total -= parseFloat(request.body.amount);
                }

                if (total < 0) {
                    return error('Operation error. Balance will be below zero.');
                }


                balances = balances.filter(
                    function (item) {
                        if (item.id === id) {
                            item.amount = request.body.amount;
                            item.type = request.body.type;
                        }
                        return item;
                    });

                localStorage.setItem('balance', JSON.stringify(balances));
                return ok([
                    {
                        success: true,
                    }
                ]);


            }

            if (request.url.match(/\/balance\/\d+$/) && request.method === 'DELETE') {
                if (!isLoggedIn) return unauthorised();
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);
                var balances = JSON.parse(localStorage.getItem('balance') || '[]');
                var total = getBalanceTotal(balances);
                balances = balances.filter(
                    function (item) {
                        if (item.id === id) {
                            if (item.type == 'credit') {
                                total -= parseFloat(item.amount);
                            }
                            return false
                        }
                        return true;
                    });

                if (total < 0) {
                    return error('Operation error. Balance will be below zero.');
                }

                localStorage.setItem('balance', JSON.stringify(balances));
                return ok([
                    {
                        success: true,
                    }
                ]);
            }

            if (request.url.endsWith('/balance') && request.method === 'PUT') {
                if (!isLoggedIn) return unauthorised();

                var balances = JSON.parse(localStorage.getItem('balance') || '[]');
                var max = balances.length;
                max++;
                var total = getBalanceTotal(balances);

                if (request.body.type == 'debit' && total < request.body.amount) {
                    return error('Operation error. Balance will be below zero.');
                }

                balances.push({
                    id: max,
                    type: request.body.type,
                    amount: request.body.amount,
                    added: Math.round(new Date().getTime() / 1000)
                });

                localStorage.setItem('balance', JSON.stringify(balances));
                return ok([
                    {
                        success: true,
                        id: max,
                    }
                ]);
            }

            // pass through any requests not handled above
            return next.handle(request);
        }))
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(materialize())
            .pipe(delay(250))
            .pipe(dematerialize());

        // private helper functions


        function getBalanceTotal(balances) {
            var total: number = 0;
            balances.forEach(function (item) {
                if (item.type == 'debit') {
                    total -= parseFloat(item.amount);
                }
                if (item.type == 'credit') {
                    total += parseFloat(item.amount);
                }
            });
            return total;
        }

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};