import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/v1/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  placeOrder(cartItems: any[]) {
    const products = cartItems.map(item => ({ id: item.id }));

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, { products }, { headers });
  }


  getUserOrders() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<{data: any}>(`${this.apiUrl}/userOrders`, { headers });
  }

  cancelOrder(id: number) {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(`${this.apiUrl}/cancel/${id}`, {}, { headers });
  }

  getAllOrders() {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<{ data: any }>(this.apiUrl, { headers });
  }

  updateOrderState(id: number, action: 'approve' | 'reject') {
    const headers = this.authService.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/${action}/${id}`, {}, { headers });
  }
}
