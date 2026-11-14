import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/registration.model';

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  customerName: string;
  username?: string;
  rating: number;
  comment: string;
  adminReply?: string;
  status: string; // APPROVED, PENDING, HIDDEN
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReviewInput {
  productId: string;
  productName: string;
  productImage?: string;
  customerName: string;
  username?: string;
  rating: number;
  comment: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly API = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(this.API);
  }

  getProductReviews(productId: string): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${this.API}/product/${productId}`);
  }

  createReview(review: CreateReviewInput): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(this.API, review);
  }

  replyReview(id: string, adminReply: string): Observable<ApiResponse<Review>> {
    return this.http.patch<ApiResponse<Review>>(`${this.API}/${id}/reply`, { adminReply });
  }

  updateStatus(id: string, status: string): Observable<ApiResponse<Review>> {
    return this.http.patch<ApiResponse<Review>>(`${this.API}/${id}/status`, { status });
  }

  deleteReview(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}

