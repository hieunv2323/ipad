import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Product } from '../models/registration.model';

export interface ChatMessageDto {
  role: 'user' | 'model';
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessageDto[];
}

export interface ChatResponseData {
  reply: string;
  recommendedProducts: Product[];
  isAiGenerated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, history: ChatMessageDto[] = []): Observable<ApiResponse<ChatResponseData>> {
    return this.http.post<ApiResponse<ChatResponseData>>(this.apiUrl, {
      message,
      history
    });
  }
}
