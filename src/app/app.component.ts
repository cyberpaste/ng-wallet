import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthenticationService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['app.component.css'] })
export class AppComponent {
    currentUser: User;
    private subscription: Subscription = new Subscription;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.subscription.add(this.authenticationService.logout().subscribe(() => {
            this.router.navigate(['/login']);
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
