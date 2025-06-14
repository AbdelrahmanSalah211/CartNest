import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-modal.component.html',
})
export class ProductModalComponent {
  @Output() productSaved = new EventEmitter<Product>();
  modalService = inject(ModalService);
  productService = inject(ProductService);
  fb = inject(FormBuilder);

  modal$ = this.modalService.modalState$;

  form = this.fb.group({
    title: ['', Validators.required],
    details: ['', Validators.required],
    quantity: [0, Validators.required],
    price: [0, Validators.required],
    image: [null],
  });

  imageFile: File | null = null;
  isSubmitting = false;

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

  submit(type: 'create' | 'edit', product?: Product) {
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('title', this.form.value.title!);
    formData.append('details', this.form.value.details!);
    formData.append('quantity', String(this.form.value.quantity!));
    formData.append('price', String(this.form.value.price!));
    if (this.imageFile) formData.append('image', this.imageFile);

    if (type === 'create') {
      this.productService.createProduct(formData).subscribe((res) => {
        this.productSaved.emit(res.data.product);
        this.close();
      });
    } else if (type === 'edit' && product?.id) {
      this.productService.updateProduct(product.id, formData).subscribe((res) => {
        this.productSaved.emit(res.data.product);
        this.close();
      });
    }
  }

  close() {
    this.modalService.closeModal();
    this.form.reset();
    this.imageFile = null;
    this.isSubmitting = false;
  }
}
