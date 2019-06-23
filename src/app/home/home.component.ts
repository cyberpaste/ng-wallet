import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User, Balance } from '@/_models';
import { UserService, AuthenticationService, BalanceService } from '@/_services';
import { MatDialog } from '@angular/material/dialog';
import { BalanceDialog } from '@/dialog/dialog.component';
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
        console.log (this.dialog);

        const dialogRef = this.dialog.open(BalanceDialog, {
            width: '250px',
            data: { name: '5', animal: 'd' }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    getBalance() {
        var total: number = 0;
        this.balance.forEach(function (item) {
            if (item.type == 'debit') {
                total += parseFloat(item.amount);
            }
            if (item.type == 'credit') {
                total -= parseFloat(item.amount);
            }
        })
        return total;
    }

    ngOnInit() {
        this.balanceService.getAll().pipe(first()).subscribe(balance => {
            this.balance = balance;
            this.total = this.getBalance();
            this.loading = false;
        });
    }
}