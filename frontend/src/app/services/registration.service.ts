import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, RegistrationInput, RegistrationUser } from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  // Spring Boot API URL (SQL Server)
  private apiUrl = 'http://localhost:8080/api/registrations';

  constructor(private http: HttpClient) {}

  /**
   * Register a new customer (POST /api/registrations)
   */
  register(data: RegistrationInput): Observable<ApiResponse<RegistrationUser>> {
    return this.http.post<ApiResponse<RegistrationUser>>(this.apiUrl, data);
  }

  /**
   * Get all registered customers (GET /api/registrations)
   */
  getRegistrations(): Observable<ApiResponse<RegistrationUser[]>> {
    return this.http.get<ApiResponse<RegistrationUser[]>>(this.apiUrl);
  }

  /**
   * Login with username and password (POST /api/registrations/login)
   */
  login(username: string, password: string): Observable<ApiResponse<RegistrationUser>> {
    return this.http.post<ApiResponse<RegistrationUser>>(`${this.apiUrl}/login`, { username, password });
  }
}
