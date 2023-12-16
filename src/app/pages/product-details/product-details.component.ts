import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsService } from '../../services/product-details/product-details.service';

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
    private route: ActivatedRoute
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
        sku: data.sku,
        category: data.category,
        name: data.name,
        description: data.description,
        features: data.features,
        color: data.color,
        sizes: data.sizes,
        stock: data.stock,
        price: data.price,
        image: data.image,
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
