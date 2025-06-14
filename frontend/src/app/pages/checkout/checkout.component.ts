import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  providers: [OrderService],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;

  constructor(private cartService: CartService, private orderService: OrderService, private toastr: ToastrService) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCart();
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  placeOrder() {
    this.orderService.placeOrder(this.cartItems).subscribe(() => {
      this.cartService.clearCart();
      this.toastr.success('Order placed successfully!', 'Success');
    });
  }
}
