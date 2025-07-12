// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isLoggedIn(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    return true;
  }

  logout() {
    localStorage.removeItem('auth_token');
  }
}
