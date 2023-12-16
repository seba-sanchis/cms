import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders/orders.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  providers: [OrdersService],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  orders: Order[] = [];
  customerQuantities: any[] = [];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.ordersService.getOrders().subscribe((data) => {
      this.orders = this.ordersService.mapStatusToSpanish(data);
      this.ordersService.updateDateFormats(this.orders);
    });
  }
}
