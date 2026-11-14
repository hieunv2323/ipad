import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/registration.model';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  username?: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  orderNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  username?: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  orderNote?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(order: CreateOrderInput): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.API, order);
  }

  getAllOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(this.API);
  }

  getMyOrders(username: string): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.API}/my/${username}`);
  }

  trackOrders(query: string): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.API}/track`, { params: { query } });
  }

  cancelOrder(id: string): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.API}/${id}/cancel`, {});
  }

  updateStatus(id: string, status: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.API}/${id}/status`, { status });
  }

  deleteOrder(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}

