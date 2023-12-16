import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsService } from '../../services/product-details/product-details.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  product: Product = {
    _id: '',
    sku: '',
    category: '',
    name: '',
    image: '',
    description: '',
    features: [],
    color: '',
    sizes: [],
    stock: [],
    sold: [],
    price: 0,
  };

  productForm!: FormGroup;

  constructor(
    private productDetailsService: ProductDetailsService,
    private route: ActivatedRoute
  ) {
    this.productForm = new FormGroup({
      sku: new FormControl(''),
      category: new FormControl(''),
      name: new FormControl(''),
      image: new FormControl(''),
      description: new FormControl(''),
      features: new FormControl(''),
      color: new FormControl(''),
      sizes: new FormControl(''),
      stock: new FormControl(''),
      price: new FormControl(''),
    });
  }

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
      this.product = data;

      // Set form values based on the fetched product
      this.productForm.patchValue({
        sku: this.product.sku,
        category: this.product.category,
        name: this.product.name,
        image: this.product.image,
        description: this.product.description,
        features: this.product.features,
        color: this.product.color,
        sizes: this.product.sizes,
        stock: this.product.stock,
        price: this.product.price,
      });
    });
  }

  // Function to handle form submission
  onSubmit(): void {
    // Retrieve the updated product data from the form
    // const updatedProduct: Product = this.productForm.value;
    // Example: this.productDetailsService.updateProduct(this.product._id, updatedProduct);
  }
}
