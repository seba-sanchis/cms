import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  users: User[] = [];
  userQuantities: any[] = [];

  ngOnInit() {
    this.getUsers();
  }

  timestamp = new Date().getTime();

  private getUsers(): void {
    this.http
      .get<User[]>(`${this.apiUrl}/api/user`, {
        headers: {
          'Cache-Control': 'no-store',
        },
      })
      .subscribe((data) => {
        this.users = data;
        this.calculateQuantities();
      });
  }

  private calculateQuantities(): void {
    this.userQuantities = this.users.map((user) => ({
      amountOfOrders: user.purchases?.length || 0,
      totalReceived: user.purchases?.reduce(
        (sum, purchase) => sum + (purchase.transaction?.received || 0),
        0
      ),
    }));
  }
}
