import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule],
  templateUrl: './order-history.component.html'
})
export class OrderHistoryComponent {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getUserOrders().subscribe(res => {
      this.orders = res.data.orders;
      console.log(this.orders);
    });
  }

  cancel(id: number) {
    this.orderService.cancelOrder(id).subscribe(() => {
      this.orders = this.orders.map(o => o.id === id ? { ...o, status: 'CANCELLED' } : o);
    });
  }
}
