import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  http = inject(HttpClient);
  products: Product[] = [];
  productQuantities: any[] = [];

  ngOnInit() {
    this.http
      .get<Product[]>('https://e-commerce.sebastiansanchis.com/api/product')
      .subscribe((data) => {
        this.products = data;
        this.calculateQuantities();
      });
  }

  calculateQuantities() {
    this.productQuantities = this.products.map((product) => ({
      stockQuantity: product.stock.reduce(
        (total, quantity) => total + quantity,
        0
      ),
      variantsQuantity: product.stock.length,
      soldQuantity: product.sold.reduce(
        (total, quantity) => total + quantity,
        0
      ),
    }));
  }
}
