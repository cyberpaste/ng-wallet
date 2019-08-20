import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import { User } from '../_models';
import { UserService } from '../_services';
import { UserDialogComponent } from './dialog/user.dialog.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  loading = true;
  displayedColumns: string[] = ['id', 'username', 'operation'];
  public datatable = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private subscription: Subscription = new Subscription;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

  tableHasElements() {
    return !this.loading && this.datatable.data !== null && this.datatable.data.length > 0;
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
        case 'username': return this.compare(a.username, b.username, isAsc);
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

  openDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '350px',
    });
    this.subscription.add(dialogRef.componentInstance.onAdd.subscribe(() => {
      this.loading = true;
      this.onLoad();
    }));
  }

  editOperation(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '350px',
      data: user,
    });
    this.subscription.add(dialogRef.componentInstance.onAdd.subscribe(() => {
      this.loading = true;
      this.onLoad();
    }));
  }

  deleteOperation(user: User) {
    this.loading = true;
    this.subscription.add(this.userService.delete(user).pipe(first()).subscribe(balance => {
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

  onLoad() {
    this.subscription.add(this.userService.getAll().pipe(first()).subscribe(data => {
      this.datatable = new MatTableDataSource<User>(data);
      this.datatable.paginator = this.paginator;
      this.datatable.sort = this.sort;
      this.loading = false;
    }, error => {
      this.openSnackBar(error, ['snakbar', 'danger-snackbar']);
      this.loading = false;
    }));
  }

  ngOnInit() {
    this.onLoad();
  }

  clearUsers() {
    this.loading = true;
    this.subscription.add(this.userService.deleteAll().pipe(first()).subscribe(data => {
      this.datatable = new MatTableDataSource<User>(data);
      this.datatable.paginator = this.paginator;
      this.datatable.sort = this.sort;
      this.loading = false;
      this.onLoad();
    }, error => {
      this.openSnackBar(error, ['snakbar', 'danger-snackbar']);
      this.loading = false;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
