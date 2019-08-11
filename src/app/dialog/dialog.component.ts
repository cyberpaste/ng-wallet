import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '../_services';
import { first } from 'rxjs/operators';


export interface DialogData {
    id?: number,
    type: string;
    amount: number;
}
@Component({
    selector: 'balance-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css']
})
export class DialogComponent {
    balanceForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    event = 'add';

    @Output() onAdd = new EventEmitter()

    types = [
        { value: 'debit', viewValue: 'Debit' },
        { value: 'credit', viewValue: 'Credit' },
    ];

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        private formBuilder: FormBuilder,
        private balanceService: BalanceService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        var type = null;
        var amount : number  = null;
        if (this.data) {
            type = this.data.type;
            amount = this.data.amount;
            this.event = 'edit';
        }
        this.balanceForm = this.formBuilder.group({
            type: [type, Validators.required],
            amount: [amount, [Validators.required, Validators.min(1), Validators.max(999999)]],
        });

    }

    get f() {
        return this.balanceForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.balanceForm.invalid) {
            return;
        }
        this.loading = true;
        var balance = {
            id: null,
            type: this.f.type.value,
            amount: this.f.amount.value,
        };


        if (this.data) {
            balance.id = this.data.id;
            this.balanceService.editOperation(balance).pipe(first()).subscribe(
                () => {
                    this.loading = false;
                    this.error = '';
                    this.onAdd.emit();
                    this.dialogRef.close();
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
        } else {
            this.balanceService.addOperation(balance).pipe(first()).subscribe(
                () => {
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
}