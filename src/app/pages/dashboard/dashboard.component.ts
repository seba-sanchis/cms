import { Component } from '@angular/core';
import { Order } from '../../models/order.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

interface BestSeller extends Product {
  totalSoldQuantity: number;
}

interface LowStock extends Product {
  remainingStock: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private apiUrl = environment.baseUrl;

  orders: Order[] = [];
  totalSales: number = 0;
  averageOrderValue: number = 0;
  totalUsers: number = 0;
  conversionRate: number = 0;
  bestSellers: BestSeller[] = [];
  lowStockProducts: LowStock[] = [];
  bagAbandonmentRate: number = 0;
  regionSales: Map<string, number> = new Map<string, number>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchOrders();
    this.fetchUsers();
    this.fetchProducts();
  }

  private fetchOrders(): void {
    this.http.get<Order[]>(`${this.apiUrl}/api/order`).subscribe((data) => {
      this.orders = data;
      this.calculateAverageOrderValue();
      this.calculateConversionRate();
      this.totalSales = this.getTotalSales();
    });
  }

  private fetchUsers(): void {
    this.http.get<User[]>(`${this.apiUrl}/api/user`).subscribe((users) => {
      this.totalUsers = users.length;
      this.calculateConversionRate();
      this.calculateBagAbandonmentRate(users);
      this.calculateRegionSales(users);
    });
  }

  private fetchProducts(): void {
    this.http
      .get<Product[]>(`${this.apiUrl}/api/product`)
      .subscribe((products) => {
        this.calculateBestSellers(products);
        this.calculateLowStockProducts(products);
      });
  }

  private getTotalSales(): number {
    return this.orders.reduce((totalSales, order) => {
      if (order.payment && order.transaction?.received) {
        totalSales += order.transaction?.received;
      }
      return totalSales;
    }, 0);
  }

  private calculateAverageOrderValue(): void {
    if (this.orders.length === 0) {
      this.averageOrderValue = 0;
      return;
    }

    const totalOrderValue = this.orders.reduce(
      (total, order) => total + (order.transaction?.received || 0),
      0
    );

    this.averageOrderValue = totalOrderValue / this.orders.length;
  }

  private calculateConversionRate(): void {
    if (this.totalUsers === 0) {
      this.conversionRate = 0;
      return;
    }

    this.conversionRate = this.orders.length / this.totalUsers;
  }

  private calculateBestSellers(products: Product[]): void {
    const bestSellers = products.map((product) => {
      const totalSoldQuantity = product.sold.reduce(
        (total, quantity) => total + quantity,
        0
      );
      return { ...product, totalSoldQuantity };
    });

    // Sort products based on total sold quantity in descending order
    this.bestSellers = bestSellers
      .sort((a, b) => b.totalSoldQuantity - a.totalSoldQuantity)
      .slice(0, 5);
  }

  private calculateLowStockProducts(products: Product[]): void {
    const lowStockProducts = products.map((product) => {
      const remainingStock = product.stock.reduce(
        (total, quantity) => total + quantity,
        0
      );
      return { ...product, remainingStock };
    });

    // Sort products based on remaining stock in ascending order
    this.lowStockProducts = lowStockProducts
      .sort((a, b) => a.remainingStock - b.remainingStock)
      .slice(0, 5);
  }

  private calculateBagAbandonmentRate(users: User[]): void {
    const usersWithItemsInBag = users.filter(
      (user) => user.bag && user.bag.length > 0
    );

    const abandonedBagUsers = usersWithItemsInBag.filter(
      (user) => !user.purchases || user.purchases.length === 0
    );

    this.bagAbandonmentRate = abandonedBagUsers.length / users.length;
  }

  private calculateRegionSales(users: User[]): void {
    users.forEach((user) => {
      if (user.purchases) {
        user.purchases.forEach((purchase) => {
          if (purchase.status === 'approved') {
            const region = user.region;
            this.regionSales.set(
              region,
              (this.regionSales.get(region) || 0) + 1
            );
          }
        });
      }
    });
  }
}
