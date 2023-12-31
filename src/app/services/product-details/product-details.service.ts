import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap } from 'rxjs';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  private apiUrl = environment.baseUrl;
  private imageUrl = environment.awsS3;

  constructor(private http: HttpClient) {}

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/api/product/${id}`);
  }

  updateProduct(id: string, product: Product, file: File): Observable<Product> {

    // If there is no file, update the product without making a request to AWS
    if (!file) {
      const productData = { ...product };

      return this.http.patch<Product>(`${this.apiUrl}/api/product/${id}`, productData);
    }
  
    // Create a new FormData and append the file with the new name
    const formData = new FormData();

    // Replace non-alphanumeric characters with hyphens and all characters converted to lowercase
    const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const imageName = `${id}_${slug}.png`;

    // Append the 'file' and 'id' to the formData
    formData.append('file', file, imageName);

    // Construct the image URL and update the product
    const image = `${this.imageUrl}/${imageName}`;
    const productData = { ...product, image };

    // Make the first HTTP POST request
    return this.http
      .patch<Product>(`${this.apiUrl}/api/product/${id}`, productData)
      .pipe(
        switchMap(() => {
          // If the first request is successful, make the second HTTP PATCH request
          return this.http.post<Product>(`${this.apiUrl}/api/aws`, formData);
        }),
        catchError((error) => {
          // Handle errors from the first or second request
          console.error('Error:', error);
          throw error; // Rethrow the error to propagate it to the subscriber
        })
      );
  }
}
