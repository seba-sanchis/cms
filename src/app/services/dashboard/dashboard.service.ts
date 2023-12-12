import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';
import { OrdersService } from '../../services/orders/orders.service';
import { UsersService } from '../../services/users/users.service';
import { ProductsService } from '../../services/products/products.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private productsService: ProductsService
  ) {}

  getOrders(): Observable<Order[]> {
    return this.ordersService.getOrders();
  }

  getUsers(): Observable<User[]> {
    return this.usersService.getUsers();
  }

  getProducts(): Observable<Product[]> {
    return this.productsService.getProducts();
  }

  calculateTotalSales(orders: Order[]): number {
    return orders.reduce((totalSales, order) => {
      if (order.payment && order.transaction?.received) {
        totalSales += order.transaction?.received;
      }
      return totalSales;
    }, 0);
  }

  calculateAverageOrderValue(orders: Order[]): number {
    if (orders.length === 0) {
      return 0;
    }

    const totalOrderValue = orders.reduce(
      (total, order) => total + (order.transaction?.received || 0),
      0
    );

    return totalOrderValue / orders.length;
  }

  calculateConversionRate(orders: Order[], totalUsers: number): number {
    if (totalUsers === 0) {
      return 0;
    }

    return orders.length / totalUsers;
  }

  calculateBestSellers(products: Product[]): BestSeller[] {
    const bestSellers = products.map((product) => {
      const totalSoldQuantity = product.sold.reduce(
        (total, quantity) => total + quantity,
        0
      );
      return { ...product, totalSoldQuantity };
    });

    // Sort products based on total sold quantity in descending order
    return bestSellers
      .sort((a, b) => b.totalSoldQuantity - a.totalSoldQuantity)
      .slice(0, 5);
  }

  calculateLowStockProducts(products: Product[]): LowStock[] {
    const lowStockProducts = products.map((product) => {
      const remainingStock = product.stock.reduce(
        (total, quantity) => total + quantity,
        0
      );
      return { ...product, remainingStock };
    });

    // Sort products based on remaining stock in ascending order
    return lowStockProducts
      .sort((a, b) => a.remainingStock - b.remainingStock)
      .slice(0, 5);
  }

  private filterUsersWithItemsInBag(users: User[]): User[] {
    return users.filter((user) => user.bag && user.bag.length > 0);
  }

  calculateBagAbandonment(users: User[]): number {
    const usersWithItemsInBag = this.filterUsersWithItemsInBag(users);

    const abandonedBagUsers = usersWithItemsInBag.filter(
      (user) => !user.purchases || user.purchases.length === 0
    );
    console.log('abandonedBagUsers ->', abandonedBagUsers.length);
    return abandonedBagUsers.length;
  }

  calculateBagAbandonmentRate(users: User[]): number {
    const usersWithItemsInBag = this.filterUsersWithItemsInBag(users);

    const abandonedBagUsers = usersWithItemsInBag.filter(
      (user) => !user.purchases || user.purchases.length === 0
    );

    return abandonedBagUsers.length / users.length;
  }

  calculateRegionSales(users: User[]): Map<string, number> {
    const regionSales = new Map<string, number>();

    users.forEach((user) => {
      if (user.purchases) {
        user.purchases.forEach((purchase) => {
          if (purchase.status === 'approved') {
            const region = user.region;
            regionSales.set(region, (regionSales.get(region) || 0) + 1);
          }
        });
      }
    });

    return regionSales;
  }
}

export interface BestSeller extends Product {
  totalSoldQuantity: number;
}

export interface LowStock extends Product {
  remainingStock: number;
}
