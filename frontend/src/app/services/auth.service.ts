import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/users';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  register(userData: any): Observable<any> {
  const formData = new FormData();
  for (const key in userData) {
    if (userData[key]) {
      formData.append(key, userData[key]);
    }
  }
  return this.http.post(`${this.apiUrl}/signup`, formData);
}


  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        console.log('Login successful:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('username', res.user.username);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('id', res.user.id);
        localStorage.setItem('photo', res.user.photo || '');
        this.redirectBasedOnRole(res.user.role);
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserPhoto(): string | null {
    return localStorage.getItem('photo');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  getUserId(): string | null {
    return localStorage.getItem('id');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private redirectBasedOnRole(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/orders']);
    } else {
      this.router.navigate(['/products']);
    }
  }

  getAuthHeaders(): HttpHeaders {
      return new HttpHeaders({
    Authorization: `Bearer ${this.getToken()}`
    });
  }
}
