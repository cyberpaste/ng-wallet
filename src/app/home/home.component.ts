import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User, Balance } from '@/_models';
import { UserService, AuthenticationService, BalanceService } from '@/_services';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@/dialog';
require('@/home/home.component.css');

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    balance: Balance[] = [];
    displayedColumns: string[] = ['id', 'type', 'amount', 'added'];
    total = 0;
    loading = true;

    constructor(
        private userService: UserService,
        private balanceService: BalanceService,
        public dialog: MatDialog,
    ) { }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '350px',
        });
        dialogRef.afterClosed().subscribe(result => {

        });
        dialogRef.componentInstance.onAdd.subscribe(() => {
            this.loading = true;
            this.onLoad();
        });
    }

    convertTime(time) {
        return new Date(time * 1000).toUTCString();
    }

    clearBalance() {
        this.loading = true;
        this.balanceService.deleteAll().pipe(first()).subscribe(balance => {
            this.balance = balance.reverse();
            this.total = this.getBalance();
            this.loading = false;
        });
        this.onLoad();
    }

    getBalance() {
        var total: number = 0;
        this.balance.forEach(function (item) {
            if (item.type == 'debit') {
                total -= parseFloat(item.amount);
            }
            if (item.type == 'credit') {
                total += parseFloat(item.amount);
            }
        })
        return total > 0 ? parseFloat(total.toFixed(2)) : 0 ;
    }

    onLoad() {
        this.balanceService.getAll().pipe(first()).subscribe(balance => {
            this.balance = balance.reverse();
            this.total = this.getBalance();
            this.loading = false;
        });
    }

    ngOnInit() {
        this.onLoad();
    }
}