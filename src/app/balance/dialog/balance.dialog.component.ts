import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '../../_services';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { DialogComponent } from '../../_base/dialog-component';
import { Balance } from '../../_models';

@Component({
    selector: 'balance-dialog',
    templateUrl: 'balance.dialog.component.html',
    styleUrls: ['balance.dialog.component.css']
})
export class BalanceDialogComponent extends DialogComponent {

    private subscription: Subscription = new Subscription;

    types = [
        { value: 'debit', viewValue: 'Debit' },
        { value: 'credit', viewValue: 'Credit' },
    ];

    constructor(
        public dialogRef: MatDialogRef<Component>,
        protected formBuilder: FormBuilder,
        private balanceService: BalanceService,
        @Inject(MAT_DIALOG_DATA) public data: Balance
    ) { super(dialogRef, formBuilder); }

    ngOnInit() {
        let type = null;
        let amount: number = null;
        if (this.data) {
            type = this.data.type;
            amount = this.data.amount;
            this.event = 'edit';
        }
        this.form = this.formBuilder.group({
            type: [type, Validators.required],
            amount: [amount, [Validators.required, Validators.min(1), Validators.max(999999)]],
        });

    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        const balance = {
            id: null,
            type: this.f.type.value,
            amount: this.f.amount.value,
        };

        if (this.data) {
            balance.id = this.data.id;
            this.subscription.add(this.balanceService.editOperation(balance).pipe(first()).subscribe(
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
            this.subscription.add(this.balanceService.addOperation(balance).pipe(first()).subscribe(
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
