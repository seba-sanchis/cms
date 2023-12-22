import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from '../../services/product-details/product-details.service';
import { Product } from '../../models/product.model';
import { CommonModule, Location } from '@angular/common';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  constructor(
    private productDetailsService: ProductDetailsService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {}

  productForm = new FormGroup({
    sku: new FormControl(''),
    category: new FormControl(''),
    name: new FormControl(''),
    image: new FormControl(''),
    description: new FormControl(''),
    features: new FormControl(['']),
    color: new FormControl(''),
    sizes: this.fb.array([]),
    stock: this.fb.array([]),
    price: new FormControl(0),
  });

  // Getter for the sizes form array
  get sizes() {
    return this.productForm.get('sizes') as FormArray;
  }

  // Getter for the stock form array
  get stock() {
    return this.productForm.get('stock') as FormArray;
  }

  // Method to add a new size control to the form array
  addSize() {
    this.sizes.push(this.fb.control(''));
    this.stock.push(this.fb.control(''));
  }

  // Method to remove a size control to the form array
  removeSize(index: number) {
    this.sizes.removeAt(index);
    this.stock.removeAt(index);
  }

  selectedFile: File | null = null;

  ngOnInit() {
    // Retrieve the 'id' from the route parameters
    this.route.params.subscribe((params) => {
      const id = params['id'];

      // Fetch the product using the retrieved 'id'
      this.fetchProduct(id);
    });
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }

  private fetchProduct(id: string): void {
    this.productDetailsService.getProduct(id).subscribe((data) => {
      // Set form values based on the fetched product
      const castedData: Partial<Product> = data as Partial<Product>;
      this.productForm.patchValue(castedData);

      // Clear existing sizes and stock controls
      this.sizes.clear();
      this.stock.clear();

      // Populate sizes controls based on the fetched product's sizes array
      data.sizes.forEach((sizeValue: string) => {
        this.sizes.push(this.fb.control(sizeValue));
      });

      // Populate stock controls based on the fetched product's stock array
      data.stock.forEach((stockValue: number) => {
        this.stock.push(this.fb.control(stockValue));
      });
    });
  }

  // Function to handle form submission
  onSubmit(): void {
    // Retrieve the updated product data from the form
    const updatedProduct: Product = this.productForm.value as Product;
    const updatedFile: File = this.selectedFile as File;

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
        .updateProduct(id, updatedProduct, updatedFile)
        .subscribe(observer);
    });
  }
}
