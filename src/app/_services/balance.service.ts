import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Balance } from '../_models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BalanceService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Balance[]>(`${environment.apiUrl}/balance`);
    }

    addOperation(balance) {
        return this.http.put<Balance[]>(`${environment.apiUrl}/balance`, balance);
    }

    deleteAll() {
        return this.http.get<Balance[]>(`${environment.apiUrl}/balance/clear`);
    }

    deleteOperation(balance) {
        return this.http.delete<Balance[]>(`${environment.apiUrl}/balance/` + balance.id);
    }

    editOperation(balance){
        return this.http.put<Balance[]>(`${environment.apiUrl}/balance/`+ balance.id, balance);
    }
}