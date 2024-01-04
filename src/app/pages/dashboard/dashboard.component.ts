import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  orders: Order[] = [];
  totalSales: number = 0;
  averageOrderValue: number = 0;
  totalUsers: number = 0;
  conversionRate: number = 0;
  bestSellers: BestSeller[] = [];
  lowStockProducts: LowStock[] = [];
  abandonedBagUsers: User[] = [];
  bagAbandonment: number = 0;
  bagAbandonmentRate: number = 0;
  regionSales: Map<string, number> = new Map<string, number>();
  monthlySales: Map<string, number> = new Map<string, number>();
  dashArrayValue: string = '';
  maxValue: number = 1000;
  lastOrders: Order[] = [];
  monthlyEarnings: number = 0;
  currentYear: number;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
    this.fetchData();
  }

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
      this.monthlySales = this.dashboardService.calculateMonthlySales(orders);
      this.monthlyEarnings = this.calculateEarningsForCurrentMonth(orders);
      this.lastOrders = this.dashboardService.getLastOrders(orders, 5);

      this.cdr.detectChanges();
    });

    this.dashboardService.getUsers().subscribe((users) => {
      this.totalUsers = users.length;
      this.calculateConversionRate();
      this.calculateBagAbandonment(users);
      this.calculateBagAbandonmentRate(users);
      this.regionSales = this.dashboardService.calculateRegionSales(users);

      this.cdr.detectChanges();
    });

    this.dashboardService.getProducts().subscribe((products) => {
      this.calculateBestSellers(products);
      this.calculateLowStockProducts(products);

      this.cdr.detectChanges();
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

  private calculateBagAbandonment(users: User[]): void {
    this.bagAbandonment = this.dashboardService.calculateBagAbandonment(users);
  }

  private calculateBagAbandonmentRate(users: User[]): void {
    this.bagAbandonmentRate =
      this.dashboardService.calculateBagAbandonmentRate(users);
  }

  private calculateEarningsForCurrentMonth(orders: Order[]): number {
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthKey = `${this.currentYear}-${currentMonth
      .toString()
      .padStart(2, '0')}`;
    let earningsForCurrentMonth = 0;

    orders.forEach((order) => {
      if (order.payment && order.transaction?.received && order.date) {
        const orderDate = new Date(order.date);
        const monthKey = `${orderDate.getFullYear()}-${(
          orderDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}`;

        if (monthKey === currentMonthKey) {
          earningsForCurrentMonth += order.transaction.received;
        }
      }
    });

    return earningsForCurrentMonth;
  }

  calculateBarHeight(value: number): number {
    return (value / this.maxValue) * 100;
  }

  getKeys(map: Map<string, number>): string[] {
    const currentYear = new Date().getFullYear().toString();
    const monthsInYear = Array.from(
      { length: 12 },
      (_, index) => `${currentYear}-${(index + 1).toString().padStart(2, '0')}`
    );

    return monthsInYear;
  }

  getMonthAbbreviation(month: string): string {
    const monthAbbreviations: { [key: string]: string } = {
      '01': 'Ene',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Abr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Ago',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dic',
    };

    return monthAbbreviations[month.split('-')[1]];
  }

  generateScaleLabels(): string[] {
    const scaleStep = this.maxValue / 4;
    const labels: string[] = [];

    for (let i = 4; i >= 0; i--) {
      labels.push((scaleStep * i).toFixed(0));
    }

    return labels;
  }
}
