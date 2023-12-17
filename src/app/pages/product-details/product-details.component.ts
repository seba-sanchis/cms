import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from '../../services/product-details/product-details.service';
import { Product } from '../../models/product.model';
import { Location } from '@angular/common';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  constructor(
    private productDetailsService: ProductDetailsService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  productForm = new FormGroup({
    sku: new FormControl(''),
    category: new FormControl(''),
    name: new FormControl(''),
    image: new FormControl(''),
    description: new FormControl(''),
    features: new FormControl(['']),
    color: new FormControl(''),
    sizes: new FormControl(['']),
    stock: new FormControl([0]),
    price: new FormControl(0),
  });

  ngOnInit() {
    // Retrieve the 'id' from the route parameters
    this.route.params.subscribe((params) => {
      const id = params['id'];

      // Fetch the product using the retrieved 'id'
      this.fetchProduct(id);
    });
  }

  private fetchProduct(id: string): void {
    this.productDetailsService.getProduct(id).subscribe((data) => {
      // Set form values based on the fetched product
      this.productForm.setValue({
        sku: data.sku || null,
        category: data.category || null,
        name: data.name || null,
        description: data.description || null,
        features: data.features || null,
        color: data.color || null,
        sizes: data.sizes || null,
        stock: data.stock || null,
        price: data.price || null,
        image: data.image || null,
      });
    });
  }

  // Function to handle form submission
  onSubmit(): void {
    // Retrieve the updated product data from the form
    const updatedProductData: Product = this.productForm.value as Product;

    // Retrieve the 'id' from the route parameters
    this.route.params.subscribe((params) => {
      const id = params['id'];

      // Call the productDetailsService to update the product
      const observer: Observer<Product> = {
        next: (updatedProduct) => {
          // Redirect to the previous page
          this.location.back();
        },
        error: (error) => {
          // Handle error, e.g., show an error message
          console.error('Error updating product:', error);
        },
        complete: () => {
          // Cleanup logic
        },
      };

      this.productDetailsService
        .updateProduct(id, updatedProductData)
        .subscribe(observer);
    });
  }
}
