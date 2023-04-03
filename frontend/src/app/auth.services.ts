import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Token } from '@angular/compiler';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }

    isLoggedIn(): Observable<boolean> {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            return this.http.get<boolean>('http://localhost:3000/authorize-login', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }).pipe(
                tap(response => {
                    if (!response) {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('currentUser');
                    }
                })
            );
        } else {
            return of(false);
        }
    }


}