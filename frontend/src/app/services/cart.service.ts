import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCount.asObservable();

  getCart() {
    return this.cart;
  }

  addToCart(product: any) {
    this.cart.push(product);
    this.cartCount.next(this.cart.length);
    console.log(product);
    console.log(this.cart);
  }

  removeFromCart(productId: string) {
    this.cart = this.cart.filter(p => p.id !== productId);
    this.cartCount.next(this.cart.length);
  }

  clearCart() {
    this.cart = [];
    this.cartCount.next(0);
  }
}
