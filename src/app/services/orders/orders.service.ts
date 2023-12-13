import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/api/order`);
  }

  mapStatusToSpanish(orders: Order[]): Order[] {
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

  updateDateFormats(orders: Order[]): Order[] {
    const datePipe = new DatePipe('en-US');
    return orders.map((order) => {
      if (order.date) {
        order.date = this.customFormatDate(order.date, datePipe);
      }
      return order;
    });
  }

  private customFormatDate(dateString: string, datePipe: DatePipe): string {
    const date = new Date(dateString);

    // Use datePipe to format the date
    let formattedDate = datePipe.transform(date, 'MMMM d, h:mm a') || '';

    // Capitalize the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    // Make "am" and "pm" lowercase
    formattedDate = formattedDate.replace(/\b(A|P)M\b/g, (match) =>
      match.toLowerCase()
    );

    return formattedDate;
  }
}
