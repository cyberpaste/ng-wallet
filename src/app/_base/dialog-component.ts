import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';


export class DialogComponent {

    public form: FormGroup;
    public loading = false;
    public submitted = false;
    public error = '';
    public event = 'add';

    @Output() onAdd = new EventEmitter();


    constructor(
        public dialogRef: MatDialogRef<Component>,
        protected formBuilder: FormBuilder,
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    get f() {
        return this.form.controls;
    }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            console.log(this.form);
            return;
        }
    }

}
