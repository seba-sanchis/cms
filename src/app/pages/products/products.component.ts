import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  products: Product[] = [];
  productQuantities: any[] = [];

  ngOnInit() {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    this.http.get<Product[]>(`${this.apiUrl}/api/product`).subscribe((data) => {
      this.products = data;
      this.calculateQuantities();
    });
  }

  private calculateQuantities(): void {
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
