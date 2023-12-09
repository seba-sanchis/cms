import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  http = inject(HttpClient);
  customers: Customer[] = [];
  customerQuantities: any[] = [];

  ngOnInit() {
    this.http
      .get<Customer[]>('https://e-commerce.sebastiansanchis.com/api/user')
      .subscribe((data) => {
        this.customers = data;
        this.calculateQuantities();
      });
  }

  calculateQuantities() {
    this.customerQuantities = this.customers.map((customer) => ({
      amountOfOrders: customer.purchases?.length || 0,
      totalReceived: customer.purchases?.reduce(
        (sum, purchase) => sum + (purchase.transaction?.received || 0),
        0
      ),
    }));
  }
}
