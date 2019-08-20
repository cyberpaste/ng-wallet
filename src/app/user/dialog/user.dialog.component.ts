import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../_services';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { equalValueValidator } from '../../_helpers/form';
import { User } from '../../_models';
import { DialogComponent } from '../../_base/dialog-component';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user.dialog.component.html',
  styleUrls: ['./user.dialog.component.css']
})
export class UserDialogComponent extends DialogComponent {

  private subscription: Subscription = new Subscription;

  constructor(
    public dialogRef: MatDialogRef<Component>,
    protected formBuilder: FormBuilder,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { super(dialogRef, formBuilder); }

  ngOnInit() {
    let username = null;
    let password = null;
    if (this.data) {
      username = this.data.username;
      password = this.data.password;
      this.event = 'edit';
    }

    this.form = this.formBuilder.group(
      {
        username: [username, Validators.required],
        password: ['', [Validators.minLength(6), Validators.maxLength(100)]],
        passwordc: ['', [Validators.minLength(6), Validators.maxLength(100)]],
      },
      { validator: equalValueValidator('password', 'passwordc') }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const user = {
      id: null,
      username: this.f.username.value,
      password: this.f.password.value,
      passwordc: this.f.passwordc.value,
    };

    if (this.data) {
      user.id = this.data.id;
      this.subscription.add(this.userService.edit(user).pipe(first()).subscribe(
        () => {
          this.loading = false;
          this.error = '';
          this.onAdd.emit();
          this.dialogRef.close();
        },
        error => {
          this.error = error;
          this.loading = false;
        }));
    } else {
      this.subscription.add(this.userService.add(user).pipe(first()).subscribe(
        () => {
          this.loading = false;
          this.error = '';
          this.onAdd.emit();
          this.dialogRef.close();
        },
        error => {
          this.error = error;
          this.loading = false;
        }));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
