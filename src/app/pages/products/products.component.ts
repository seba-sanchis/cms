import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/product.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products: Product[] = [];
  productQuantities: any[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    this.productsService.getProducts().subscribe((data) => {
      this.products = data;
      this.calculateQuantities();
    });
  }

  private calculateQuantities(): void {
    this.productQuantities = this.productsService.calculateQuantities(
      this.products
    );
  }
}
