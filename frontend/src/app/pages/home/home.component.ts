import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  providers: [ProductService]
})
export class HomeComponent implements OnInit {
  promotionalProducts: any[] = [];
  loading = true;

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit() {
    this.productService.getPromotionalProducts().subscribe(response => {
      this.promotionalProducts = response.data.products;
      this.loading = false;
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
