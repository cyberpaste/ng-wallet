import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    add(user) {
        return this.http.put<User[]>(`${environment.apiUrl}/users`, user);
    }

    deleteAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users/clear`);
    }

    delete(user) {
        return this.http.delete<User[]>(`${environment.apiUrl}/users/` + user.id);
    }

    edit(user) {
        return this.http.put<User[]>(`${environment.apiUrl}/users/` + user.id, user);
    }
}
