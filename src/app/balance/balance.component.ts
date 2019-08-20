import { Component, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import { Balance } from '../_models';
import { BalanceService } from '../_services';
import { BalanceDialogComponent } from './dialog/balance.dialog.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';


@Component({
    templateUrl: 'balance.component.html',
    styleUrls: ['balance.component.css']
})
export class BalanceComponent {

    displayedColumns: string[] = ['id', 'type', 'amount', 'added', 'operation'];
    total = 0;
    loading = true;
    public datatable = new MatTableDataSource();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    private subscription: Subscription = new Subscription;


    constructor(
        private balanceService: BalanceService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) { }

    tableHasElements() {
        return !this.loading && this.datatable.data !== null && this.datatable.data.length > 0;
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(BalanceDialogComponent, {
            width: '350px',
        });
        this.subscription.add(dialogRef.componentInstance.onAdd.subscribe(() => {
            this.loading = true;
            this.onLoad();
        }));
    }

    sortData(event) {
        const data: any = this.datatable.data.slice();
        if (!event.active || event.direction === '') {
            this.datatable.data = data;
            return;
        }
        const isAsc = event.direction === 'asc';
        this.datatable.data = data.sort((a, b) => {
            switch (event.active) {
                case 'id': return this.compare(a.id, b.id, isAsc);
                case 'added': return this.compare(a.added, b.added, isAsc);
                default: return 0;
            }
        });
    }

    applyFilter(filterValue: string) {
        this.datatable.filter = filterValue.trim().toLowerCase();
    }

    compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    convertTime(time) {
        return new Date(time * 1000).toUTCString();
    }

    clearBalance() {
        this.loading = true;
        this.subscription.add(this.balanceService.deleteAll().pipe(first()).subscribe(data => {
            this.datatable = new MatTableDataSource<Balance>(data);
            this.datatable.paginator = this.paginator;
            this.datatable.sort = this.sort;
            this.total = this.getBalance();
            this.loading = false;
        }, error => {
            this.openSnackBar(error, ['snakbar', 'danger-snackbar']);
            this.loading = false;
        }));
        this.onLoad();
    }

    getBalance() {
        let total = 0;
        if (this.datatable.data !== null && this.datatable.data.length > 0) {
            this.datatable.data.forEach(function (item: Balance) {
                const amount = item.amount;
                switch (item.type) {
                    case 'debit': total -= amount; break;
                    case 'credit': total += amount; break;
                }
            });
        }
        return total > 0 ? parseFloat(total.toFixed(2)) : 0;
    }

    onLoad() {
        this.subscription.add(this.balanceService.getAll().pipe(first()).subscribe(data => {
            this.datatable = new MatTableDataSource<Balance>(data);
            this.datatable.paginator = this.paginator;
            this.datatable.sort = this.sort;
            this.total = this.getBalance();
            this.loading = false;
        }, error => {
            this.openSnackBar(error, ['snakbar', 'danger-snackbar']);
            this.loading = false;
        }));
    }

    editOperation(balance: Balance) {
        const dialogRef = this.dialog.open(BalanceDialogComponent, {
            width: '350px',
            data: balance,
        });
        this.subscription.add(dialogRef.componentInstance.onAdd.subscribe(() => {
            this.loading = true;
            this.onLoad();
        }));
    }

    deleteOperation(item: Balance) {
        this.loading = true;
        this.subscription.add(this.balanceService.deleteOperation(item).pipe(first()).subscribe(data => {
            this.loading = false;
            this.onLoad();
        }, error => {
            this.openSnackBar(error, ['snakbar', 'danger-snackbar']);
            this.loading = false;
        }));

    }

    openSnackBar(message: string, panelClass: any) {
        this.snackBar.openFromComponent(SnackbarComponent, {
            data: message,
            panelClass,
            duration: 2000,
            horizontalPosition: 'right',
        });
    }

    ngOnInit() {
        this.onLoad();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
