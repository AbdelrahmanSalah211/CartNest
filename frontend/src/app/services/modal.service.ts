import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalState = new BehaviorSubject<{ type: 'create' | 'edit' | null, data?: Product }>({ type: null });
  modalState$ = this.modalState.asObservable();

  openCreateModal() {
    this.modalState.next({ type: 'create' });
  }

  openEditModal(product: Product) {
    this.modalState.next({ type: 'edit', data: product });
  }

  closeModal() {
    this.modalState.next({ type: null });
  }
}
