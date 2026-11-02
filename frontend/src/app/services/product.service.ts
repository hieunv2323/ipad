import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Product, CreateProductInput } from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Spring Boot API URL (SQL Server)
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  /**
   * Get all products from Cloudflare Worker API
   */
  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl);
  }

  /**
   * Add a new product (Admin action)
   */
  addProduct(productData: CreateProductInput): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, productData);
  }

  /**
   * Update an existing product (Admin action)
   */
  updateProduct(id: string, productData: CreateProductInput): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, productData);
  }

  /**
   * Delete a product by ID (Admin action)
   */
  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
