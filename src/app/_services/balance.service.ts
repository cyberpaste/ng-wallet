import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Balance } from '@/_models';

@Injectable({ providedIn: 'root' })
export class BalanceService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Balance[]>(`${config.apiUrl}/balance`);
    }
}