import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ModalService } from '../../services/modal.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductModalComponent],
  providers: [ProductService],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  loading = true;
  hasMore = true;
  page = 1;
  isAdmin = false;

  constructor(private productService: ProductService, private cartService: CartService, private authService: AuthService, private modalService: ModalService) {}

  ngOnInit() {
    this.fetchProducts();
    this.isAdmin = this.authService.getUserRole() === 'admin';
    // console.log('Is Admin:', this.isAdmin);
    // console.log('Is Admin2:', this.authService.getUserRole() === 'admin');
    window.addEventListener('scroll', this.onScroll, true);
  }

  onScroll = (): void => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300 && this.hasMore && !this.loading) {
      this.loading = true;
      this.fetchProducts();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll, true);
  }

  fetchProducts() {
    this.productService.getProducts(this.page).subscribe(response => {
      this.products = [...this.products, ...response.data.products];
      this.hasMore = response.data.hasMore;
      this.loading = false;
      this.page++;
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openCreateModal() {
    this.modalService.openCreateModal();
  }

  openEditModal(product: any) {
    this.modalService.openEditModal(product);
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.products = this.products.filter(p => p.id !== productId);
    });
  }

  handleProductSaved(savedProduct: any) {
  const index = this.products.findIndex(p => p.id === savedProduct.id);

  if (index !== -1) {
    this.products[index] = savedProduct;
    console.log('Saved Product:', savedProduct);
  } else {
    this.products.unshift(savedProduct);
  }
}
}
