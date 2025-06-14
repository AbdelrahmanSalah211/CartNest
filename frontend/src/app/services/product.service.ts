import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/v1/products';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getProducts(page: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`);
  }

  getPromotionalProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}?sort=quantity&limit=20`);
  }

  createProduct(formData: FormData) {
    return this.http.post<{ data: { product: Product } }>(
      this.apiUrl,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  updateProduct(id: number, formData: FormData) {
    return this.http.patch<{ data: { product: Product } }>(
      `${this.apiUrl}/${id}`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
