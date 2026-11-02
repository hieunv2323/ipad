export interface RegistrationInput {
  fullName: string;
  phoneNumber: string;
  address: string;
  username: string;
  password: string;
}

export interface RegistrationUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  username: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface Product {
  id: string;
  name: string;
  series: string;
  capacity: string;
  color: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  rating: number;
  reviewsCount: number;
  badge: string | null;
  isHot?: boolean;
  createdAt?: string;
}

export interface CreateProductInput {
  name: string;
  series: string;
  capacity: string;
  color: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  isHot?: boolean;
}
