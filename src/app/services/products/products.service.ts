import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/api/product`);
  }

  calculateQuantities(products: Product[]): any[] {
    return products.map((product) => ({
      stockQuantity: product.stock.reduce((total, quantity) => total + quantity, 0),
      variantsQuantity: product.stock.length,
      soldQuantity: product.sold.reduce((total, quantity) => total + quantity, 0),
    }));
  }
}
