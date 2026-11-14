import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/registration.model';
import { Order } from './order.service';
import { Review } from './review.service';

export interface SeriesStat {
  series: string;
  orderCount: number;
  totalRevenue: number;
  percentage: number;
}

export interface PaymentStat {
  method: string;
  label: string;
  orderCount: number;
  totalRevenue: number;
  percentage: number;
}

export interface TopProductStat {
  productId: string;
  productName: string;
  productImage?: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface AnalyticsSummary {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;

  pendingOrders: number;
  confirmedOrders: number;
  shippingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;

  totalReviews: number;
  averageStoreRating: number;
  ratingBreakdown: { [key: number]: number };

  revenueBySeries: SeriesStat[];
  revenueByPaymentMethod: PaymentStat[];
  topSellingProducts: TopProductStat[];

  recentOrders: Order[];
  recentReviews: Review[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly API = 'http://localhost:8080/api/analytics';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<ApiResponse<AnalyticsSummary>> {
    return this.http.get<ApiResponse<AnalyticsSummary>>(`${this.API}/summary`);
  }
}

