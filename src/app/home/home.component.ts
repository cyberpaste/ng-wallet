import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { Balance } from '../_models';
import { BalanceService } from '../_services';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog';
import { SnackbarComponent } from '../snackbar';

@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.css'] })
export class HomeComponent {
    balance: Balance[] = [];
    displayedColumns: string[] = ['id', 'type', 'amount', 'added', 'operation'];
    total = 0;
    loading = true;

    constructor(
        private balanceService: BalanceService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) { }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '350px',
        });
        dialogRef.componentInstance.onAdd.subscribe(() => {
            this.loading = true;
            this.onLoad();
        });

        dialogRef.afterClosed().subscribe(result => {

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
            let amount = parseFloat(item.amount);
            switch (item.type) {
                case 'debit': total -= amount; break;
                case 'credit': total += amount; break;
            }
        })
        return total > 0 ? parseFloat(total.toFixed(2)) : 0;
    }

    onLoad() {
        this.balanceService.getAll().pipe(first()).subscribe(balance => {
            this.balance = balance.reverse();
            this.total = this.getBalance();
            this.loading = false;
        });
    }

    editOperation(balance: Balance) {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '350px',
            data: balance,
        });
        dialogRef.afterClosed().subscribe(result => {

        });
        dialogRef.componentInstance.onAdd.subscribe(() => {
            this.loading = true;
            this.onLoad();
        });
    }

    deleteOperation(balance: Balance) {
        this.loading = true;
        this.balanceService.deleteOperation(balance).pipe(first()).subscribe(balance => {
            this.loading = false;
            this.onLoad();
        }, error => {
            this.loading = false;
            this.openSnackBar(error, ['snakbar', 'danger-snackbar']);
        });

    }

    openSnackBar(message: string, panelClass: any) {
        this.snackBar.openFromComponent(SnackbarComponent, {
            data: message,
            panelClass: panelClass,
            duration: 2000,
            horizontalPosition: 'right',
        });
    }

    ngOnInit() {
        this.onLoad();
    }

    ngOnDestroy() {

    }
}