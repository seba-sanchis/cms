import { Component } from '@angular/core';
import { Order } from '../../models/order.model';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  private apiUrl = environment.baseUrl;

  orders: Order[] = [];
  customerQuantities: any[] = [];

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.http.get<Order[]>(`${this.apiUrl}/api/order`).subscribe((data) => {
      this.orders = this.mapStatusToSpanish(data);
      this.updateDateFormats();
    });
  }

  private updateDateFormats(): void {
    this.orders.forEach((order) => {
      if (order.date) {
        order.date = this.customFormatDate(order.date);
      }
    });
  }

  private customFormatDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'MMMM d, h:mm a') || '';

    // Convert to Spanish
    return this.convertToSpanish(formattedDate);
  }

  private convertToSpanish(dateString: string): string {
    const replacements: Record<string, string> = {
      January: 'Enero',
      February: 'Febrero',
      March: 'Marzo',
      April: 'Abril',
      May: 'Mayo',
      June: 'Junio',
      July: 'Julio',
      August: 'Agosto',
      September: 'Septiembre',
      October: 'Octubre',
      November: 'Noviembre',
      December: 'Diciembre',
      AM: 'am',
      PM: 'pm',
    };

    // Replace months and AM/PM
    let formattedSpanishDate = dateString;
    Object.keys(replacements).forEach((key) => {
      formattedSpanishDate = formattedSpanishDate.replace(
        key,
        replacements[key]
      );
    });

    return formattedSpanishDate;
  }

  private mapStatusToSpanish(orders: Order[]): Order[] {
    const statusMapping: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      inprocess: 'En proceso',
      inmediation: 'En mediación',
      rejected: 'Rechazado',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado',
      chargedback: 'Contracargo',
    };

    return orders.map((order) => {
      if (order.status) {
        order.status =
          statusMapping[order.status.toLowerCase()] || order.status;
      }
      return order;
    });
  }
}
