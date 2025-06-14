import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe(res => {
      this.orders = res.data.orders;
    });
  }

  updateStatus(id: number, status: 'approved' | 'rejected') {
    const action = status === 'approved' ? 'approve' : 'reject';
    this.orderService.updateOrderState(id, action).subscribe(() => {
      this.orders = this.orders.map(order =>
        order.id === id ? { ...order, status } : order
      );
    });
  }

  getProductTitles(order: any): string {
    return order.products?.map((p: any) => p.title).join(', ') || 'No products';
  }
}
