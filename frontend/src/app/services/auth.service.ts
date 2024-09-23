import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth'; // URL base da API
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('jwtToken'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(map(response => {
        if (response && response.accessToken) {
          // Armazena o token JWT no localStorage
          localStorage.setItem('jwtToken', response.accessToken);
          this.currentUserSubject.next(response.accessToken);
        }
        return response;
      }));
  }

  register(name: string, email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password });
  }

  logout() {
    // Remove o token do localStorage ao fazer logout
    localStorage.removeItem('jwtToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }
}
