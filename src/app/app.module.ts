import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  MatTableModule,
  MatDialogModule,
  MatSelectModule,
  MatSnackBarModule,
  MatPaginatorModule,
  MatSortModule,
} from '@angular/material';

import { fakeBackendProvider } from './_helpers';
import { backendProvider } from './_helpers';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BalanceComponent } from './balance/balance.component';
import { BalanceDialogComponent } from './balance/dialog/balance.dialog.component';
import { SnackbarComponent } from './snackbar/snackbar.component';

import { UserComponent } from './user/user.component';
import { UserDialogComponent } from './user/dialog/user.dialog.component';

import { PipesModule } from './_pipes/pipes.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BalanceComponent,
    BalanceDialogComponent,
    SnackbarComponent,
    UserComponent,
    UserDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    PipesModule,

  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    environment.production ? backendProvider : fakeBackendProvider,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    BalanceDialogComponent,
    SnackbarComponent,
    UserDialogComponent,
  ]
})
export class AppModule { }
