import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DashboardService,
  BestSeller,
  LowStock,
} from '../../services/dashboard/dashboard.service';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  orders: Order[] = [];
  totalSales: number = 0;
  averageOrderValue: number = 0;
  totalUsers: number = 0;
  conversionRate: number = 0;
  bestSellers: BestSeller[] = [];
  lowStockProducts: LowStock[] = [];
  bagAbandonmentRate: number = 0;
  regionSales: Map<string, number> = new Map<string, number>();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchData();
  }

  dashArrayValue: string = '';

  // Inside your component logic
  calculateDashArray(rate: number): string {
    this.dashArrayValue = `${rate * 283}, 283`;
    return this.dashArrayValue;
  }

  private fetchData(): void {
    this.dashboardService.getOrders().subscribe((orders) => {
      this.orders = orders;
      this.calculateAverageOrderValue();
      this.calculateConversionRate();
      this.totalSales = this.dashboardService.calculateTotalSales(orders);
    });

    this.dashboardService.getUsers().subscribe((users) => {
      this.totalUsers = users.length;
      this.calculateConversionRate();
      this.calculateBagAbandonmentRate(users);
      this.regionSales = this.dashboardService.calculateRegionSales(users);
    });

    this.dashboardService.getProducts().subscribe((products) => {
      this.calculateBestSellers(products);
      this.calculateLowStockProducts(products);
    });
  }

  private calculateAverageOrderValue(): void {
    this.averageOrderValue = this.dashboardService.calculateAverageOrderValue(
      this.orders
    );
  }

  private calculateConversionRate(): void {
    this.conversionRate = this.dashboardService.calculateConversionRate(
      this.orders,
      this.totalUsers
    );
  }

  private calculateBestSellers(products: Product[]): void {
    this.bestSellers = this.dashboardService.calculateBestSellers(products);
  }

  private calculateLowStockProducts(products: Product[]): void {
    this.lowStockProducts =
      this.dashboardService.calculateLowStockProducts(products);
  }

  private calculateBagAbandonmentRate(users: User[]): void {
    this.bagAbandonmentRate =
      this.dashboardService.calculateBagAbandonmentRate(users);
  }
}
