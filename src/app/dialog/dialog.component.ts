import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '@/_services';
import { first } from 'rxjs/operators';

require('@/dialog/dialog.component.css');
export interface DialogData {
    type: string;
    amount: number;
}
@Component({
    selector: 'balance-dialog',
    templateUrl: 'dialog.component.html',
})
export class DialogComponent {
    balanceForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    onAdd = new EventEmitter();


    types = [
        { value: 'debit', viewValue: 'Debit' },
        { value: 'credit', viewValue: 'Credit' },
    ];

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private formBuilder: FormBuilder,
        private balanceService: BalanceService,
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.balanceForm = this.formBuilder.group({
            type: ['', Validators.required],
            amount: ['', [Validators.required, Validators.min(1), Validators.max(999999)]],
        });
    }

    get f() { return this.balanceForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.balanceForm.invalid) {
            return;
        }
        this.loading = true;
        var balance = {
            type: this.f.type.value,
            amount: this.f.amount.value.toFixed(2) == this.f.amount.value ? this.f.amount.value : this.f.amount.value.toFixed(2) ,
            added: Math.round(new Date().getTime() / 1000)
        };
        this.balanceService.addOperation(balance).pipe(first()).subscribe(
            balance => {
                this.loading = false;
                this.error = '';
                this.onAdd.emit();
                this.dialogRef.close();
            },
            error => {
                this.error = error;
                this.loading = false;
            });
    }
}